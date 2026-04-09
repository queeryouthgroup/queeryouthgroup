import { NextRequest, NextResponse } from 'next/server';
import { getGraphClient } from '@/lib/microsoft-graph';

// Map your categories to the specific OneDrive Folder IDs
const FOLDER_MAP: Record<string, string | undefined> = {
  publications: process.env.ONEDRIVE_PUBLICATIONS_ID,
  academic: process.env.ONEDRIVE_ACADEMIC_ID,
  legal: process.env.ONEDRIVE_LEGAL_ID,
  reports: process.env.ONEDRIVE_REPORTS_ID,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'publications';
  const folderId = FOLDER_MAP[category];

  if (!folderId) {
    return NextResponse.json({ error: 'Invalid category or Folder ID not configured' }, { status: 400 });
  }

  try {
    const client = await getGraphClient();
    
    // Fetch files with thumbnails expanded in one go to save API calls
    const response = await client
      .api(`/drives/${process.env.ONEDRIVE_DRIVE_ID}/items/${folderId}/children`)
      .expand('thumbnails') // Gets covers automatically
      .select('id,name,webUrl,size,lastModifiedDateTime,thumbnails')
      .get();

    const books = response.value.map((file: any) => ({
      id: file.id,
      title: file.name.replace('.pdf', ''), // Default title
      webUrl: file.webUrl,
      lastModified: file.lastModifiedDateTime,
      size: file.size,
      // Grab the large thumbnail if it exists
      coverImage: file.thumbnails?.[0]?.large?.url || null,
    }));

    return NextResponse.json({ books });
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
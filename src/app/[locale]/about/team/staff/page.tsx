// staff/page.tsx
export const dynamic = "force-dynamic";

import { alegreyaSans } from "@/ui/fonts";
import Card from "@/components/Card";
import { sanityFetch } from "@/sanity/lib/live";
import { TEAM_PAGE_QUERY } from "@/sanity/lib/queries";

// Base slug for this specific page
const BASE_SLUG = "staff";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function StaffPage({ params }: PageProps) {
    const { locale } = await params;
    
    // Construct the dynamic slug: e.g., "staff-en" or "staff-ne"
    const localizedSlug = `${BASE_SLUG}-${locale}`;

    try {
        const { data: staffPage } = await sanityFetch({ 
            query: TEAM_PAGE_QUERY, 
            params: { slug: localizedSlug, locale } // passing locale in case your query needs it for field selection
        });

        if (!staffPage) {
            throw new Error(`No staff content found for slug: ${localizedSlug}`);
        }

        return (
            <div className={`${alegreyaSans.className} w-full flex flex-col flex-grow bg-white items-center`}>
                <div className="text-center text-2xl">
                    <h1 className={`${alegreyaSans.className} text-black font-bold py-4 mt-4`}>
                        {staffPage.title}
                    </h1>
                </div>

                {/* Iterate through Sections/Departments from Sanity */}
                {staffPage.sections?.map((section: any, index: number) => (
                    <div key={index} className="w-full max-w-6xl mb-8">
                        <div className="text-center mb-6">
                            <h2 className={`${alegreyaSans.className} text-black font-semibold text-xl`}>
                                {section.sectionTitle}
                            </h2>
                        </div>

                        <div className="flex flex-col items-center md:flex-row md:flex-wrap md:justify-center gap-4 px-4">
                            {section.members?.map((member: any, mIdx: number) => (
                                <Card 
                                    key={mIdx}
                                    image={member.image}
                                    name={member.name}
                                    // Logic to pick role based on locale if you use multiple role fields
                                    role={member.role} 
                                    pronoun={member.pronoun}
                                    email={member.email}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );

    } catch (error) {
        console.error('Error loading staff from Sanity:', error);

        return (
            <div className="w-full flex flex-col flex-grow bg-white items-center justify-center min-h-[50vh]">
                <h1 className={`${alegreyaSans.className} text-red-600 font-bold text-2xl`}>
                    Content not available
                </h1>
                <p className="text-gray-600 mt-2">
                    Could not load the staff directory for the current language.
                </p>
            </div>
        );
    }
}
// media/page.tsx
export const dynamic = "force-dynamic";

import { alegreyaSans } from "@/ui/fonts";
import { getLocalizedPostWithFallback } from "@/lib/getLocalizedPostWithFallback";
import { client } from "@/sanity/lib/client";
import type { PortableTextBlock } from "@portabletext/types";
import type { GalleryImage } from "@/sanity/schemaTypes/galleryImageType";
import { PrideMediaGallery } from "@/components/MediaGallery";

const BASE_SLUG = "pride-media";

const galleryImagesQuery = `*[_type == "galleryImage"] | order(order asc) {
  _id,
  title,
  order,
  image {
    asset,
    alt
  }
}`;

async function getGalleryImages() {
  return client.fetch<GalleryImage[]>(galleryImagesQuery);
}

type BodyImage = PortableTextBlock & {
  _type: 'image';
  _key?: string;
  asset: { _ref: string };
  alt?: string;
};

function extractBodyImages(body: PortableTextBlock[] = [], startIndex = 0) {
  return body
    .filter((block): block is BodyImage => (block as any)?._type === 'image' && !!(block as any)?.asset?._ref)
    .map((block, index) => ({
      _id: block._key ?? `body-image-${startIndex + index}`,
      _type: 'galleryImage' as const,
      title: block.alt ?? '',
      image: {
        _type: 'image' as const,
        asset: block.asset,
        alt: block.alt,
      },
      order: startIndex + index,
    }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  try {
    const [postContent, galleryImages] = await Promise.all([
      getLocalizedPostWithFallback(locale, BASE_SLUG),
      getGalleryImages(),
    ]);

    const bodyImages = extractBodyImages(postContent.body, galleryImages.length);
    const allImages = [...galleryImages, ...bodyImages];

    return (
      <div className="w-full flex flex-col grow bg-[#fafafc]">
        <div className="flex flex-col items-center mt-4 px-4 md:px-16 mb-16">
          <h1 className={`${alegreyaSans.className} text-black py-4 font-bold text-2xl`}>
            {postContent.title}
          </h1>

          <PrideMediaGallery images={allImages} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading post from Sanity:", error);
    return (
      <div className="w-full flex flex-col grow bg-[#fafafc]">
        <div className="flex flex-col items-center min-h-[30vh] mt-4">
          <h1 className={`${alegreyaSans.className} text-red-600 py-4 font-bold text-2xl`}>
            Content not available
          </h1>
          <p className="text-gray-600 px-16 py-2">
            Sorry, the content could not be loaded from Sanity at this time.
          </p>
        </div>
      </div>
    );
  }
}
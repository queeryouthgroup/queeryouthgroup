// app/[locale]/pride/timeline/[slug]/page.tsx

export const dynamic = "force-dynamic";

import { alegreyaSans } from "@/ui/fonts";
import { getLocalizedPostWithFallback } from "@/lib/getLocalizedPostWithFallback";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/components/PortableTextComponent";

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export default async function PrideEventPage({ params }: PageProps) {
    const { locale, slug } = await params;

    try {
        const postContent = await getLocalizedPostWithFallback(locale, slug);

        return (
            <div className="w-full flex flex-col flex-grow bg-[#fafafc]">
                <div className="flex flex-col items-center mt-4 px-16 md:mx-64 sm:mx-2 mb-16">
                    <h1 className={`${alegreyaSans.className} text-black py-4 font-bold text-2xl`}>
                        {postContent.title}
                    </h1>
                    <div className="w-full">
                        <PortableText
                            value={postContent.body}
                            components={portableTextComponents}
                        />
                    </div>
                </div>
            </div>
        );

    } catch (error) {
        console.error(`Error loading pride event post [${slug}]:`, error);

        return (
            <div className="w-full flex flex-col flex-grow bg-[#fafafc]">
                <div className="flex flex-col items-center min-h-[30vh] mt-4">
                    <h1 className={`${alegreyaSans.className} text-red-600 py-4 font-bold text-2xl`}>
                        Content not available
                    </h1>
                    <p className="text-gray-600 px-16 py-2">
                        Sorry, the content for this event could not be loaded at this time.
                    </p>
                </div>
            </div>
        );
    }
}
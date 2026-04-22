// multilingualism/page.tsx

// forcing dynamic rendering
export const dynamic = "force-dynamic";

import { alegreyaSans } from "@/ui/fonts";
import { getLocalizedPostWithFallback } from "@/lib/getLocalizedPostWithFallback";
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from "@/components/PortableTextComponent"; // Import the reusable components
import Image from "next/image";

// Base slug
const BASE_SLUG = "legal-administrative-reform";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    
    try {
        // Fetch the multilingualism post from Sanity
        const postContent = await getLocalizedPostWithFallback(locale, BASE_SLUG);

        return (
            <div className="w-full flex flex-col grow bg-[#fafafc]">
                
                {/* Multilingualism Section */}
                <div className="flex flex-col items-center mt-4 px-16 md:mx-64 sm:mx-2 mb-16">
                    <h1 className={`${alegreyaSans.className} text-black py-4 font-bold text-2xl`}>
                        {postContent.title}
                    </h1>

                    {/* Image for the section */}
                    <div className="flex justify-center mb-8 mt-4">
                        <Image 
                            src="/images/icons/legal-administrative-reform.png"
                            alt="legal and policy reform"
                            width={240}
                            height={240}
                        />
                    </div>
                    
                    {/* Use imported PortableText components to render the content */}
                    <div className="w-full">
                        <PortableText 
                            value={postContent.body} 
                            components={portableTextComponents} // Using imported components
                        />
                    </div>
                </div>

            </div>
        );

    } catch (error) {
        console.error('Error loading post from Sanity:', error);

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
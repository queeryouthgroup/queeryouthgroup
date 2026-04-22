// about/page.tsx

// forcing dynamic rendering
export const dynamic = "force-dynamic";

import { alegreyaSans } from "@/ui/fonts";
import { getLocalizedPostWithFallback } from "@/lib/getLocalizedPostWithFallback";
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from "@/components/PortableTextComponent";
import Image from "next/image";

// Base slugs
const ABOUT_SLUG = "about-us";
const LOGO_SLUG = "logo";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    
    try {
        // Fetch both posts from Sanity
        const [aboutPost, logoPost] = await Promise.all([
            getLocalizedPostWithFallback(locale, ABOUT_SLUG),
            getLocalizedPostWithFallback(locale, LOGO_SLUG),
        ]);

        return (
            <div className="w-full flex flex-col grow bg-[#fafafc]">
                
                {/* About Section */}
                <div className="flex flex-col items-center mt-4 px-16 md:mx-64 sm:mx-2">
                    <h1 className={`${alegreyaSans.className} text-black py-4 font-bold text-2xl`}>
                        {aboutPost.title}
                    </h1>
                    
                    {/* Use imported PortableText component */}
                    <div className="w-full">
                        <PortableText 
                            value={aboutPost.body} 
                            components={portableTextComponents}
                        />
                    </div>
                </div>

                {/* Logo Section */}
                <div className="flex flex-col items-center mt-4 px-16 md:mx-64 sm:mx-2 mb-16">
                    <h1 className={`${alegreyaSans.className} text-black py-4 font-bold text-2xl`}>
                        {logoPost.title}
                    </h1>

                    <div className="flex justify-center mb-16">
                        <Image 
                            src="/qyg-logo.svg"
                            alt="organization logo"
                            width={400}
                            height={400}
                        />
                    </div>

                    {/* Use imported PortableText component */}
                    <div className="w-full">
                        <PortableText 
                            value={logoPost.body} 
                            components={portableTextComponents}
                        />
                    </div>
                </div>

            </div>
        );

    } catch (error) {
        console.error('Error loading posts from Sanity:', error);

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
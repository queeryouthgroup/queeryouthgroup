import { alegreyaSans, roboto } from "@/ui/fonts";
import { getTranslations } from "next-intl/server";

// Base slug without locale suffix
const BASE_SLUG = "overview-of-pride-parade";

async function getPridePost(locale: string) {
    // Dynamically create the localized slug
    const localizedSlug = `${BASE_SLUG}-${locale}`;
    
    console.log(`Fetching post with slug: ${localizedSlug}`);
    
    const res = await fetch(
        `https://queeryouthgroup.org.np/wp-json/wp/v2/posts?slug=${localizedSlug}`,
        { 
            cache: "no-store",
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );

    if (!res.ok) {
        console.error(`Failed to fetch post with slug: ${localizedSlug}`);
        
        // Fallback to English version if the localized version doesn't exist
        if (locale !== 'en') {
            console.log(`Falling back to English version: ${BASE_SLUG}-en`);
            return getPridePost('en');
        }
        
        throw new Error(`Failed to fetch post: ${res.status} ${res.statusText}`);
    }
    
    const posts = await res.json();
    
    if (!posts || posts.length === 0) {
        console.error(`No post found with slug: ${localizedSlug}`);
        
        // Fallback to English if no post found
        if (locale !== 'en') {
            console.log(`No post found, falling back to English version`);
            return getPridePost('en');
        }
        
        throw new Error(`No post found with slug: ${localizedSlug}`);
    }
    
    return posts[0];
}

// Alternative function with error handling and better logging
async function getPridePostWithFallback(locale: string, baseSlug: string = BASE_SLUG) {
    const slugsToTry = [
        `${baseSlug}-${locale}`,  // Try localized version first
        ...(locale !== 'en' ? [`${baseSlug}-en`] : []), // Fallback to English if not already English
        baseSlug // Final fallback to base slug without suffix
    ];

    for (const slug of slugsToTry) {
        try {
            console.log(`Attempting to fetch: ${slug}`);
            
            const res = await fetch(
                `https://queeryouthgroup.org.np/wp-json/wp/v2/posts?slug=${slug}`,
                { 
                    cache: "no-store",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (res.ok) {
                const posts = await res.json();
                if (posts && posts.length > 0) {
                    console.log(`Successfully fetched post with slug: ${slug}`);
                    return posts[0];
                }
            }
        } catch (error) {
            console.error(`Error fetching slug ${slug}:`, error);
            continue;
        }
    }
    
    throw new Error(`No post found for any of the attempted slugs: ${slugsToTry.join(', ')}`);
}

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations('pridePage');
    
    try {
        // Use the fallback version for better error handling
        const pridePost = await getPridePostWithFallback(locale);

        return(
            <div className="w-full flex flex-col flex-grow bg-[#fafafc]">
                <div className="flex flex-col items-center min-h-[30vh] mt-4">
                    <div className="text-center text-2xl">
                        <h1 className={`${alegreyaSans.className} text-black py-4 font-bold`}>
                            {pridePost.title.rendered}
                        </h1>
                    </div>

                    <div 
                        className={`${roboto.className} text-bg text-justify px-16 py-2 text-black md:mx-64 sm:mx-2 mb-8`}
                        dangerouslySetInnerHTML={{
                            __html: pridePost.content.rendered,
                        }}
                    />
                    
                    {/* Debug info (remove in production) */}
                    {/* <div className="text-xs text-gray-500 mt-2">
                        Current locale: {locale} | Post ID: {pridePost.id}
                    </div> */}
                </div>
            </div>
        );
        
    } catch (error) {
        console.error('Error loading pride post:', error);
        
        return(
            <div className="w-full flex flex-col flex-grow bg-[#fafafc]">
                <div className="flex flex-col items-center min-h-[30vh] mt-4">
                    <div className="text-center text-2xl">
                        <h1 className={`${alegreyaSans.className} text-red-600 py-4 font-bold`}>
                            {t('errorTitle') || 'Content not available'}
                        </h1>
                    </div>
                    <p className={`${roboto.className} text-gray-600 px-16 py-2`}>
                        {t('errorMessage') || 'Sorry, the content could not be loaded at this time.'}
                    </p>
                </div>
            </div>
        );
    }
}
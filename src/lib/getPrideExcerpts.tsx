// lib/getPrideExcerpts.ts

import { client } from "@/sanity/lib/client";

export interface PrideExcerpt {
    slug: string;
    title: string;
    excerpt: string;
    date?: string;
    year: string;
}

export async function getPrideExcerpts(locale: string): Promise<PrideExcerpt[]> {
    // Fetch all pride parade posts for the given locale, falling back to English
    const query = `
        *[_type == "post" && slug.current match "nepal-pride-*" || 
          _type == "post" && slug.current match "online-pride-*"] {
            "slug": slug.current,
            title,
            excerpt,
            publishedAt
        }
    `;

    const posts = await client.fetch<{
        slug: string;
        title: string;
        excerpt: string;
        publishedAt?: string;
    }[]>(query);

    if (!posts || posts.length === 0) return [];

    // Separate into localized and English posts
    const localizedSuffix = `-${locale}`;
    const englishSuffix = `-en`;

    // Build a map: baseSlug -> best matching post (prefer locale, fallback to en)
    const baseSlugMap = new Map<string, {
        slug: string;
        title: string;
        excerpt: string;
        publishedAt?: string;
    }>();

    for (const post of posts) {
        // Extract base slug by stripping -en / -ne (or any 2-letter locale suffix)
        const baseSlug = post.slug.replace(/-[a-z]{2}$/, '');

        const isLocalized = post.slug.endsWith(localizedSuffix);
        const isEnglish = post.slug.endsWith(englishSuffix);

        if (isLocalized) {
            // Always prefer the localized version
            baseSlugMap.set(baseSlug, post);
        } else if (isEnglish && !baseSlugMap.has(baseSlug)) {
            // Only use English if no localized version found yet
            baseSlugMap.set(baseSlug, post);
        }
    }

    // Convert map to PrideExcerpt array
    return Array.from(baseSlugMap.entries()).map(([baseSlug, post]) => {
        // Extract year from slug e.g. "nepal-pride-2019" -> "2019"
        const yearMatch = baseSlug.match(/(\d{4})$/);
        const year = yearMatch ? yearMatch[1] : '';

        return {
            slug: baseSlug,
            title: post.title,
            excerpt: post.excerpt,
            date: post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString(
                    locale === 'ne' ? 'ne-NP' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )
                : undefined,
            year,
        };
    });
}
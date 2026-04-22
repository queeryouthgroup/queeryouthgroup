// app/[locale]/pride/timeline/page.tsx
import React from 'react';
// import { useTranslations, useLocale } from 'next-intl';
import TimelineClient from '@/components/TimelineClient';
import { getPrideExcerpts, PrideExcerpt } from '@/lib/getPrideExcerpts';
import { getTranslations } from 'next-intl/server';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function TimelinePage({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'prideTimelinePage' });

    // Fetch all pride excerpts from Sanity for this locale
    const excerpts = await getPrideExcerpts(locale);

    const translations = {
        title: t('title'),
        subtitle: t('subtitle'),
        footerText: t('footerText'),
        readMore: t('readMore'),
    };

    return (
        <main>
            <TimelineClient
                locale={locale}
                translations={translations}
                excerpts={excerpts}
            />
        </main>
    );
}
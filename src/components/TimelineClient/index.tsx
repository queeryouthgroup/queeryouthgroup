'use client';
// app/[locale]/pride/timeline/TimelineClient.tsx

import React, { useState } from 'react';
import { PrideExcerpt } from '@/lib/getPrideExcerpts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Translations {
    title: string;
    subtitle: string;
    footerText: string;
    readMore: string;
}

interface TimelineClientProps {
    locale: string;
    translations: Translations;
    excerpts: PrideExcerpt[];
}

interface TimelineEventProps {
    year: string;
    title?: string;
    date?: string;
    excerpt?: string;
    isLeft: boolean;
    hasEvent: boolean;
    slug?: string;
    locale: string;
    readMore: string;
}

// ─── All years shown on the timeline ─────────────────────────────────────────

const TIMELINE_YEARS = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];

// ─── Timeline Event ───────────────────────────────────────────────────────────

const TimelineEvent: React.FC<TimelineEventProps> = ({
    year,
    title,
    date,
    excerpt,
    isLeft,
    hasEvent,
    slug,
    locale,
    readMore,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    if (!hasEvent) {
        return (
            <div className="flex items-center mb-8 relative">
                {/* Left side */}
                <div className="flex-1 px-6">
                    {!isLeft && (
                        <div className="text-right">
                            <span className="text-gray-400 font-semibold bg-gray-100 px-3 py-1 rounded-full">
                                {year}
                            </span>
                        </div>
                    )}
                </div>

                {/* Timeline dot */}
                <div className="w-4 h-4 bg-gray-300 rounded-full border-4 border-white z-10 relative"></div>

                {/* Right side */}
                <div className="flex-1 px-6">
                    {isLeft && (
                        <div className="text-left">
                            <span className="text-gray-400 font-semibold bg-gray-100 px-3 py-1 rounded-full">
                                {year}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-start mb-8 relative ${isLeft ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1 px-6 relative">
                {/* Collapsed pill */}
                <div
                    className={`cursor-pointer transition-all duration-300 ${isLeft ? 'text-right' : 'text-left'}`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div
                        className={`inline-block bg-pink-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-pink-700 transition-all duration-300 ${
                            isHovered ? 'scale-105' : ''
                        }`}
                    >
                        <h3 className="text-lg font-bold">{title}</h3>
                        <p className="text-pink-100 text-sm">{year}</p>
                    </div>
                </div>

                {/* Expanded hover card */}
                <div
                    className={`absolute top-0 ${isLeft ? 'right-0' : 'left-0'} w-80 z-20 transition-all duration-300 ${
                        isHovered
                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div
                        className={`bg-[#F5EFE0] p-6 rounded-lg shadow-lg ${
                            isLeft ? 'border-r-4 border-pink-600' : 'border-l-4 border-pink-600'
                        }`}
                    >
                        <h3 className="text-xl font-bold text-pink-800 mb-2">{title}</h3>
                        {date && (
                            <p className="text-pink-700 font-semibold mb-3">{date}</p>
                        )}
                        {excerpt && (
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                {excerpt}
                            </p>
                        )}
                        {slug && (
                            <div className={isLeft ? 'text-right' : 'text-left'}>
                                <a
                                    href={`/${locale}/pride/timeline/${slug}`}
                                    className="inline-flex items-center bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                                >
                                    {readMore}
                                    <svg
                                        className={`w-4 h-4 ${isLeft ? 'mr-2 rotate-180' : 'ml-2'}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Arrow pointing toward timeline dot */}
                    <div
                        className={`absolute top-6 ${
                            isLeft
                                ? 'left-0 -translate-x-2'
                                : 'right-0 translate-x-2'
                        }`}
                    >
                        <div
                            className={`w-0 h-0 border-t-8 border-b-8 border-transparent ${
                                isLeft
                                    ? 'border-r-8 border-r-[#F5EFE0]'
                                    : 'border-l-8 border-l-[#F5EFE0]'
                            }`}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Timeline dot */}
            <div className="w-4 h-4 bg-pink-600 rounded-full border-4 border-white z-10 relative shadow-md mt-3"></div>

            <div className="flex-1"></div>
        </div>
    );
};

// ─── Main Client Component ────────────────────────────────────────────────────

const TimelineClient: React.FC<TimelineClientProps> = ({
    locale,
    translations,
    excerpts,
}) => {
    // Build a lookup map: year -> PrideExcerpt
    const excerptsByYear = new Map<string, PrideExcerpt>(
        excerpts.map((e) => [e.year, e])
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-12 pt-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-pink-800 mb-4">
                        {translations.title}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {translations.subtitle}
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative pb-8">
                    {/* Vertical line */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 w-1 h-full"
                        style={{ backgroundColor: '#d41367' }}
                    ></div>

                    {TIMELINE_YEARS.map((year, index) => {
                        const event = excerptsByYear.get(year);
                        const hasEvent = !!event;

                        // Positioning: empty years alternate left/right by index;
                        // event years also alternate but can be overridden here if needed.
                        const isLeft = index % 2 === 0;

                        return (
                            <TimelineEvent
                                key={year}
                                year={year}
                                title={event?.title}
                                date={event?.date}
                                excerpt={event?.excerpt}
                                slug={event?.slug}
                                isLeft={isLeft}
                                hasEvent={hasEvent}
                                locale={locale}
                                readMore={translations.readMore}
                            />
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="text-center mt-12 pt-8 border-t border-pink-200">
                    <p className="text-gray-500 text-sm">{translations.footerText}</p>
                </div>
            </div>
        </div>
    );
};

export default TimelineClient;
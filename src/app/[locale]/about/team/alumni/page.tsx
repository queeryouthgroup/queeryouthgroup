// alumni/page.tsx
export const dynamic = "force-dynamic";

import { alegreyaSans } from "@/ui/fonts";
import Card from "@/components/Card";
import { sanityFetch } from "@/sanity/lib/live";
import { TEAM_PAGE_QUERY } from "@/sanity/lib/queries";

const BASE_SLUG = "alumni";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function AlumniPage({ params }: PageProps) {
    const { locale } = await params;
    const localizedSlug = `${BASE_SLUG}-${locale}`;

    try {
        const { data: alumniData } = await sanityFetch({ 
            query: TEAM_PAGE_QUERY, 
            params: { slug: localizedSlug } 
        });

        if (!alumniData || !alumniData.sections?.[0]) {
            throw new Error(`Alumni content not found for ${localizedSlug}`);
        }

        const members = alumniData.sections[0].members || [];
        const alumniTitle = alumniData.title;

        return (
            <div className={`${alegreyaSans.className} w-full flex flex-col flex-grow bg-white items-center`}>
                <div className="text-center text-2xl">
                    <h1 className={`${alegreyaSans.className} text-black font-bold py-4 mt-4`}>
                        {alumniTitle}
                    </h1>
                </div>

                {/* 3-column grid that persists as rows are added */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 mb-8 w-full max-w-6xl">
                    {members.map((member: any, index: number) => (
                        <div key={index} className="flex justify-center">
                            <Card 
                                image={member.image}
                                name={member.name}
                                // Alumni usually don't have roles/emails in your JSON, 
                                // but the Card component handles them if they exist in Sanity
                                role={member.role}
                                pronoun={member.pronoun}
                                email={member.email}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );

    } catch (error) {
        console.error('Error loading alumni from Sanity:', error);
        return (
            <div className="w-full flex flex-col flex-grow bg-white items-center justify-center min-h-[50vh]">
                <h1 className={`${alegreyaSans.className} text-red-600 font-bold text-2xl`}>
                    Content not available
                </h1>
            </div>
        );
    }
}
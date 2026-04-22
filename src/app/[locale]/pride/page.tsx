// pride/page.tsx 
// forcing dynamic rendering
export const dynamic = "force-dynamic";

import { useTranslations, useLocale } from 'next-intl';
import { alegreyaSans, notoSansDevanagari } from "@/ui/fonts";
import { NavigationCard } from '@/components/NavigationCards';

interface PrideLink {
  title: string;
  route: string;
  description: string;
  icon: string;
}

interface PrideRootPageData {
  title: string;
  links: PrideLink[];
}

export default function PrideRootPage() {
  const t = useTranslations();
  const locale = useLocale();
  const pridePage: PrideRootPageData = t.raw('PrideRootPage') as PrideRootPageData;

  // Locale-based font
  const headerFont =
    locale === "ne"
      ? notoSansDevanagari.className
      : alegreyaSans.className;

  return (
    <div className={`w-full flex flex-col grow bg-white items-center`}>
        {/* Header */}
        <div className="text-center text-2xl">
            <h1 className={`${headerFont} text-black font-bold py-4 mt-4`}>
            {pridePage.title}
            </h1>
        </div>

        {/* Navigation Cards */}
        <div className="w-full max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
                {pridePage.links.map((link, index) => (
                <NavigationCard
                    key={`team-${index}-${link.route}`}
                    title={link.title}
                    href={link.route}
                    description={link.description}
                    icon={link.icon}
                    variant="tertiary"
                    size="md"
                    className="h-full"
                />
                ))}
            </div>
        </div>
    </div>
  );
}

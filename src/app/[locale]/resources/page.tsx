// publications/page.tsx 
// forcing dynamic rendering
export const dynamic = "force-dynamic";

import { useLocale } from 'next-intl';
import { alegreyaSans, notoSansDevanagari } from "@/ui/fonts";
import { NavigationCard } from '@/components/NavigationCards';

interface ResourceLink {
  title: string;
  route: string;
  description: string;
  icon: string;
}

export default function ResourcesRootPage() {
  const locale = useLocale();

  const resourcesPage = {
    title: locale === "en" ? "Resources" : "स्रोतहरू",
    links: [
      {
        title: locale === "en" ? "Academic Report" : "शैक्षिक स्रोतहरू",
        route: "/resources/academic-report",
        description: locale === "en" ? "Access academic reports and studies" : "शैक्षिक प्रतिवेदन र अध्ययनहरू पहुँच गर्नुहोस्",
        icon: "📚"
      },
      {
        title: locale === "en" ? "Legal Resources" : "कानुनी स्रोतहरू",
        route: "/resources/legal",
        description: locale === "en" ? "Legal documents and resources" : "कानुनी कागजात र स्रोतहरू",
        icon: "⚖️"
      },
      {
        title: locale === "en" ? "Publications" : "प्रकाशन",
        route: "/resources/publications",
        description: locale === "en" ? "Published materials and documents" : "प्रकाशित सामग्री र कागजातहरू",
        icon: "📄"
      },
      {
        title: locale === "en" ? "Reports" : "प्रतिवेदन",
        route: "/resources/reports",
        description: locale === "en" ? "Various reports and findings" : "विभिन्न प्रतिवेदन र निष्कर्षहरू",
        icon: "📊"
      }
    ]
  };

  // Locale-based font
  const headerFont =
    locale === "ne"
      ? notoSansDevanagari.className
      : alegreyaSans.className;

  return (
    <div className={`w-full flex flex-col flex-grow bg-white items-center`}>
        {/* Header */}
        <div className="text-center text-2xl">
            <h1 className={`${headerFont} text-black font-bold py-4 mt-4`}>
            {resourcesPage.title}
            </h1>
        </div>

        {/* Navigation Cards */}
        <div className="w-full max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
                {resourcesPage.links.map((link, index) => (
                <NavigationCard
                    key={`resource-${index}-${link.route}`}
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
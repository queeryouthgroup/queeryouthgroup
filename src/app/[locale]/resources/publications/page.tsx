// app/publications/page.tsx
'use client';

import PublicationPage from "@/components/PublicationPage";
import { useLocale } from "next-intl";

export const dynamic = "force-dynamic";

export default function Page() {
  const lang = useLocale();

  return (
    <PublicationPage 
      category="publications" 
      title={lang == "en" ? "Publications" : "प्रकाशन"} 
    />
  );
}
// app/publications/page.tsx
'use client';

import PublicationPage from "@/components/PublicationPage";
import { useLocale } from "next-intl";

export const dynamic = "force-dynamic";

export default function Page() {
  const lang = useLocale();

  return (
    <PublicationPage 
      category="academic" 
      title={lang == "en" ? "Academic Reports" : "शैक्षिक स्रोतहरू"}
    />
  );
}
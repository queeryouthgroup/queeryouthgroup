import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AccessibilityProvider } from "@/components/AccessibilityWidget/AccessibilityProvider"; // Fixed path
import AccessibilityWidget from "@/components/AccessibilityWidget"; // This imports from index.tsx
import "../globals.css";
import "@/components/AccessibilityWidget/AccessibilityStyles.css"; // Fixed path
import "yet-another-react-lightbox/styles.css";

export const metadata: Metadata = {
  title: "Queer Youth Group Nepal",
  description: "",
  icons: {
    icon: "/qyg-logo.svg",
  }
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  // Ensure that the incoming locale is valid
  const {locale} = await params;
  
  if(!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body className="min-h-screen w-full flex flex-col flex-grow">
        <AccessibilityProvider>
          <NextIntlClientProvider>
            {/* Skip to main content link for screen readers */}
            <a href="#main-content" className="accessibility-skip-link">
              {locale === 'ne' ? 'मुख्य सामग्रीमा जानुहोस्' : 'Skip to main content'}
            </a>

            {/* Header */}
            <Header lang={locale}/>
            
            {/* Navbar content */}
            <Navbar lang={locale} />

            {/* Main content area */}
            <main id="main-content">
              {children}
            </main>

            {/* Footer content */}
            <Footer lang={locale} />

            {/* Accessibility Widget */}
            <AccessibilityWidget lang={locale as "en" | "ne"} />
          </NextIntlClientProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
import { Metadata } from "next";
import { Suspense } from "react";
import LegalNoticePageClient from "@/components/pages/LegalNoticePageClient";
import { LOCALES, type Locale } from "@/types/locale";
import {
  DEFAULT_OG_IMAGE,
  SEO_LEGAL_NOTICE,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale: locale.code,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO_LEGAL_NOTICE[locale];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: { index: true, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale(locale, "/aviso-legal"),
      siteName: "Tenerifly.io",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: ogLocale(locale),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale(locale, "/aviso-legal"),
      languages: hreflangAlternates("/aviso-legal"),
    },
  };
}

export default function AvisoLegalLocalePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <LegalNoticePageClient />
    </Suspense>
  );
}

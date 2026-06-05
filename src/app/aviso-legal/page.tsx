import { SITE_BRAND } from "@/lib/site";
import { Metadata } from "next";
import { Suspense } from "react";
import LegalNoticePageClient from "@/components/pages/LegalNoticePageClient";
import {
  DEFAULT_OG_IMAGE,
  SEO_LEGAL_NOTICE,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = SEO_LEGAL_NOTICE.en;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: { index: true, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale("en", "/aviso-legal"),
      siteName: SITE_BRAND,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: ogLocale("en"),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale("en", "/aviso-legal"),
      languages: hreflangAlternates("/aviso-legal"),
    },
  };
}

export default function AvisoLegalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <LegalNoticePageClient />
    </Suspense>
  );
}

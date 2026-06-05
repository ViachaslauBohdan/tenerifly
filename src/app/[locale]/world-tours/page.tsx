import { SITE_BRAND } from "@/lib/site";
import { Metadata } from "next";
import { Suspense } from "react";
import WorldToursPageClient from "../../world-tours/client";
import { LOCALES, type Locale } from "@/types/locale";
import {
  DEFAULT_OG_IMAGE,
  SEO_WORLD_TOURS,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

// 7 days — keep in sync with CMS_PAGE_REVALIDATE in src/config/cmsCache.ts
export const revalidate = 604800;

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
  const seo = SEO_WORLD_TOURS[locale];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale(locale, "/world-tours"),
      siteName: SITE_BRAND,
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
      canonical: absoluteUrlForLocale(locale, "/world-tours"),
      languages: hreflangAlternates("/world-tours"),
    },
  };
}

export default async function WorldToursPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <WorldToursPageClient />
    </Suspense>
  );
}

import { SITE_BRAND } from "@/lib/site";
import { getAllProperties } from "@/services/ssgDataService";
import { Metadata } from "next";
import { Suspense } from "react";
import ApartmentsPageClient from "../../apartments/client";
import { LOCALES, type Locale } from "@/types/locale";
import {
  DEFAULT_OG_IMAGE,
  SEO_APARTMENTS,
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

// Генерация метаданных для страницы
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO_APARTMENTS[locale];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale(locale, "/apartments"),
      siteName: SITE_BRAND,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Tenerife Stays",
        },
      ],
      locale: ogLocale(locale),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale(locale, "/apartments"),
      languages: hreflangAlternates("/apartments"),
    },
  };
}

export default async function ApartmentsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  try {
    const { locale } = await params;
    // Locale-aware CMS fetch (`ua` → `uk`), EN fallback when empty
    const properties = await getAllProperties(locale);

    console.log(
      "🏠 SSG: Page loaded with",
      properties?.length || 0,
      "properties for",
      locale
    );

    return (
      <Suspense fallback={null}>
        <ApartmentsPageClient initialProperties={properties} />
      </Suspense>
    );
  } catch (error) {
    console.error("❌ SSG: Error in ApartmentsPage:", error);
    // Return page with empty data to prevent build failure
    return (
      <Suspense fallback={null}>
        <ApartmentsPageClient initialProperties={[]} />
      </Suspense>
    );
  }
}

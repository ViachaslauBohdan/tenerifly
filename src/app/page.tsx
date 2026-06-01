import { Metadata } from "next";
import { Suspense } from "react";
import { HomePageFallback } from "@/components/HomePageFallback";
import { LocalePageClient } from "./LocalePageClient";
import {
  DEFAULT_OG_IMAGE,
  SEO_HOME,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

// 7 days — keep in sync with CMS_PAGE_REVALIDATE in src/config/cmsCache.ts
export const revalidate = 604800;

// Генерация метаданных для главной страницы
export async function generateMetadata(): Promise<Metadata> {
  const seo = SEO_HOME.en;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale("en", ""),
      siteName: "Tenerifly.io",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Tenerife - Canary Islands",
        },
      ],
      locale: ogLocale("en"),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale("en", ""),
      languages: hreflangAlternates(""),
    },
  };
}

export default function RootPage() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <LocalePageClient />
    </Suspense>
  );
}

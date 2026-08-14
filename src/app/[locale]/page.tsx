import { SITE_BRAND } from "@/lib/site";
import { getHomePageData } from "@/services/ssgDataService";
import { Metadata } from "next";
import { Suspense } from "react";
import { HomePageFallback } from "@/components/HomePageFallback";
import { LocalePageClient } from "../LocalePageClient";
import { LOCALES, type Locale } from "@/types/locale";
import {
  DEFAULT_OG_IMAGE,
  SEO_HOME,
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

// Генерация метаданных для главной страницы
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localeCode = LOCALES.some((l) => l.code === locale)
    ? (locale as Locale)
    : LOCALES[0].code;
  const seo = SEO_HOME[localeCode];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale(localeCode, ""),
      siteName: SITE_BRAND,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Tenerife - Canary Islands",
        },
      ],
      locale: ogLocale(localeCode),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale(localeCode, ""),
      languages: hreflangAlternates(""),
    },
  };
}

export default async function LocaleRootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeCode = LOCALES.some((l) => l.code === locale)
    ? (locale as Locale)
    : LOCALES[0].code;
  // Получаем данные на сервере для SSG с трансформацией
  const homeData = await getHomePageData(localeCode);

  return (
    <Suspense fallback={<HomePageFallback />}>
      <LocalePageClient initialData={homeData} locale={localeCode} />
    </Suspense>
  );
}

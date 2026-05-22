import { Metadata } from "next";
import { Suspense } from "react";
import ToursPageClient from "../../tours/client";
import { LOCALES, type Locale } from "@/types/locale";
import {
  DEFAULT_OG_IMAGE,
  SEO_TOURS,
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
  const seo = SEO_TOURS[locale];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale(locale, "/tours"),
      siteName: "Tenerifly.io",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Tenerife Tours",
        },
      ],
      locale: ogLocale(locale),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale(locale, "/tours"),
      languages: hreflangAlternates("/tours"),
    },
  };
}

export default async function ToursPage({
  params: _params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  return (
    <Suspense fallback={null}>
      <ToursPageClient />
    </Suspense>
  );
}

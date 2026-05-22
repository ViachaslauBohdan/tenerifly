import { getAllCarsAllLocales } from "@/services/ssgDataService";
import { Metadata } from "next";
import { Suspense } from "react";
import CarsPageClient from "../../cars/client";
import { LOCALES, type Locale } from "@/types/locale";
import {
  DEFAULT_OG_IMAGE,
  SEO_CARS,
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
  const seo = SEO_CARS[locale];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale(locale, "/cars"),
      siteName: "Tenerifly.io",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Tenerife Car Rental",
        },
      ],
      locale: ogLocale(locale),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale(locale, "/cars"),
      languages: hreflangAlternates("/cars"),
    },
  };
}

export default async function CarsPage({
  params: _params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  // Получаем автомобили для всех поддерживаемых локалей с группировкой
  const carsByLocale = await getAllCarsAllLocales();

  return (
    <Suspense fallback={null}>
      <CarsPageClient
        initialCarsByLocale={carsByLocale as Record<string, unknown[]>}
      />
    </Suspense>
  );
}

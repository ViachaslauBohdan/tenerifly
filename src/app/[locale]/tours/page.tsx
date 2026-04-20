import { getAllTours } from "@/services/ssgDataService";
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

// ISR настройки - обновление каждые 6 часов
export const revalidate = 21600;

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
          alt: "Tenerife Tours & Excursions",
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
  // Получаем все данные экскурсий на сервере для SSG с кэшированием
  const tours = await getAllTours();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToursPageClient initialTours={tours} />
    </Suspense>
  );
}

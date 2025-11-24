import { getAllTours } from "@/services/ssgDataService";
import { Metadata } from "next";
import { Suspense } from "react";
import ToursPageClient from "../../tours/client";
import { LOCALES, type Locale } from "@/types/locale";

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

  return {
    title: "Tours & Excursions in Tenerife | Tenerifly.io",
    description:
      "Discover amazing tours and excursions in Tenerife. From Teide National Park to whale watching, find the best guided tours and activities in the Canary Islands.",
    keywords: [
      "Tenerife tours",
      "Tenerife excursions",
      "Teide National Park",
      "whale watching Tenerife",
      "Tenerife activities",
      "Canary Islands tours",
      "Tenerife guided tours",
    ],
    openGraph: {
      title: "Tours & Excursions in Tenerife | Tenerifly.io",
      description:
        "Discover amazing tours and excursions in Tenerife. From Teide National Park to whale watching, find the best guided tours.",
      url: `https://tenerifly.io/${locale}/tours`,
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife Tours & Excursions",
        },
      ],
      locale: locale === "en" ? "en_US" : locale === "ru" ? "ru_RU" : locale === "pl" ? "pl_PL" : locale === "fr" ? "fr_FR" : locale === "uk" ? "uk_UA" : locale === "de" ? "de_DE" : "es_ES",
      type: "website",
    },
    alternates: {
      canonical: `https://tenerifly.io/${locale}/tours`,
      languages: Object.fromEntries(
        LOCALES.map((loc) => [`${loc.code}`, `https://tenerifly.io/${loc.code}/tours`])
      ),
    },
  };
}

export default async function ToursPage({
  params,
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


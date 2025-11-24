import { getAllCarsAllLocales } from "@/services/ssgDataService";
import { Metadata } from "next";
import { Suspense } from "react";
import CarsPageClient from "../../cars/client";
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
    title: "Car Rental in Tenerife | Tenerifly.io",
    description:
      "Rent a car in Tenerife. Browse our selection of cars for rent or sale. From economy to luxury vehicles, find your perfect car for exploring the Canary Islands.",
    keywords: [
      "Tenerife car rental",
      "Tenerife car hire",
      "Canary Islands car rental",
      "Tenerife airport car rental",
      "Tenerife car sales",
      "Tenerife vehicle rental",
    ],
    openGraph: {
      title: "Car Rental in Tenerife | Tenerifly.io",
      description:
        "Rent a car in Tenerife. Browse our selection of cars for rent or sale. From economy to luxury vehicles.",
      url: `https://tenerifly.io/${locale}/cars`,
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife Car Rental",
        },
      ],
      locale: locale === "en" ? "en_US" : locale === "ru" ? "ru_RU" : locale === "pl" ? "pl_PL" : locale === "fr" ? "fr_FR" : locale === "uk" ? "uk_UA" : locale === "de" ? "de_DE" : "es_ES",
      type: "website",
    },
    alternates: {
      canonical: `https://tenerifly.io/${locale}/cars`,
      languages: Object.fromEntries(
        LOCALES.map((loc) => [`${loc.code}`, `https://tenerifly.io/${loc.code}/cars`])
      ),
    },
  };
}

export default async function CarsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  // Получаем автомобили для всех поддерживаемых локалей с группировкой
  const carsByLocale = await getAllCarsAllLocales();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarsPageClient
        initialCarsByLocale={carsByLocale as Record<string, unknown[]>}
      />
    </Suspense>
  );
}


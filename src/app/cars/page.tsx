import { getAllCarsAllLocales } from "@/services/ssgDataService";
import { Metadata } from "next";
import { Suspense } from "react";
import CarsPageClient from "./client";
import {
  DEFAULT_OG_IMAGE,
  SEO_CARS,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

// ISR настройки - обновление каждые 6 часов
export const revalidate = 21600;

// Генерация метаданных для страницы
export async function generateMetadata(): Promise<Metadata> {
  const seo = SEO_CARS.en;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale("en", "/cars"),
      siteName: "Tenerifly.io",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Tenerife Car Rental",
        },
      ],
      locale: ogLocale("en"),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale("en", "/cars"),
      languages: hreflangAlternates("/cars"),
    },
  };
}

export default async function CarsPage() {
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

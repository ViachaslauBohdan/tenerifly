import { getAllCarsAllLocales } from "@/services/ssgDataService";
import { Metadata } from "next";
import { Suspense } from "react";
import CarsPageClient from "./client";

// ISR настройки - обновление каждые 6 часов
export const revalidate = 21600;

// Генерация метаданных для страницы
export async function generateMetadata(): Promise<Metadata> {
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
      url: "https://tenerifly.io/cars",
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife Car Rental",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: "https://tenerifly.io/cars",
      languages: {
        en: "https://tenerifly.io/cars",
        pl: "https://tenerifly.io/cars",
        fr: "https://tenerifly.io/cars",
        ru: "https://tenerifly.io/cars",
        uk: "https://tenerifly.io/cars",
        de: "https://tenerifly.io/cars",
        es: "https://tenerifly.io/cars",
      },
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

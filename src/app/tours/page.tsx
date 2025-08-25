import { getAllTours } from "@/services/ssgDataService";
import { Metadata } from "next";
import { Suspense } from "react";
import ToursPageClient from "./client";

// ISR настройки - обновление каждые 6 часов
export const revalidate = 21600;

// Генерация метаданных для страницы
export async function generateMetadata(): Promise<Metadata> {
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
      url: "https://tenerifly.io/tours",
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife Tours & Excursions",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: "https://tenerifly.io/tours",
      languages: {
        en: "https://tenerifly.io/tours",
        pl: "https://tenerifly.io/tours",
        fr: "https://tenerifly.io/tours",
        ru: "https://tenerifly.io/tours",
        uk: "https://tenerifly.io/tours",
        de: "https://tenerifly.io/tours",
        es: "https://tenerifly.io/tours",
      },
    },
  };
}

export default async function ToursPage() {
  // Получаем все данные экскурсий на сервере для SSG с кэшированием
  const tours = await getAllTours();
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToursPageClient initialTours={tours} />
    </Suspense>
  );
}

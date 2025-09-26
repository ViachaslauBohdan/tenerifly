import { getAllProperties } from "@/services/ssgDataService";
import { Metadata } from "next";
import { Suspense } from "react";
import ApartmentsPageClient from "./client";

// ISR настройки - обновление каждые 6 часов
export const revalidate = 21600;

// Генерация метаданных для страницы
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Accommodation in Tenerife | Tenerifly.io",
    description:
      "Find your perfect accommodation in Tenerife. Browse apartments, villas, and houses for rent or sale. Book directly with local providers.",
    keywords: [
      "Tenerife accommodation",
      "Tenerife apartments",
      "Tenerife villas",
      "Tenerife rental",
      "Tenerife property",
      "Canary Islands accommodation",
    ],
    openGraph: {
      title: "Accommodation in Tenerife | Tenerifly.io",
      description:
        "Find your perfect accommodation in Tenerife. Browse apartments, villas, and houses for rent or sale.",
      url: "https://tenerifly.io/apartments",
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife Accommodation",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: "https://tenerifly.io/apartments",
      languages: {
        en: "https://tenerifly.io/apartments",
        pl: "https://tenerifly.io/apartments",
        fr: "https://tenerifly.io/apartments",
        ru: "https://tenerifly.io/apartments",
        uk: "https://tenerifly.io/apartments",
        de: "https://tenerifly.io/apartments",
        es: "https://tenerifly.io/apartments",
      },
    },
  };
}

export default async function ApartmentsPage() {
  // Получаем все данные апартаментов на сервере для SSG с кэшированием
  console.log("ApartmentsPage: Starting to fetch properties");
  const properties = await getAllProperties();
  console.log("ApartmentsPage: Received properties:", properties);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApartmentsPageClient initialProperties={properties} />
    </Suspense>
  );
}

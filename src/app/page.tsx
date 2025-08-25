import { getHomePageData } from "@/services/ssgDataService";
import { Metadata } from "next";
import { LocalePageClient } from "./LocalePageClient";

// ISR настройки - обновление каждые 6 часов
export const revalidate = 21600;

// Генерация метаданных для главной страницы
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tenerifly.io - Your Gateway to Tenerife",
    description:
      "Discover the best of Tenerife with Tenerifly.io. Find accommodation, rent cars, book tours, and explore the Canary Islands. Your complete travel companion for Tenerife adventures.",
    keywords: [
      "Tenerife",
      "Canary Islands",
      "Tenerife accommodation",
      "Tenerife car rental",
      "Tenerife tours",
      "Tenerife travel",
      "Canary Islands travel",
    ],
    openGraph: {
      title: "Tenerifly.io - Your Gateway to Tenerife",
      description:
        "Discover the best of Tenerife with Tenerifly.io. Find accommodation, rent cars, book tours, and explore the Canary Islands.",
      url: "https://tenerifly.io",
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife - Canary Islands",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: "https://tenerifly.io",
      languages: {
        en: "https://tenerifly.io",
        pl: "https://tenerifly.io",
        fr: "https://tenerifly.io",
        ru: "https://tenerifly.io",
        uk: "https://tenerifly.io",
        de: "https://tenerifly.io",
        es: "https://tenerifly.io",
      },
    },
  };
}

export default async function RootPage() {
  // Получаем данные на сервере для SSG с трансформацией
  const homeData = await getHomePageData("en");

  return <LocalePageClient initialData={homeData} />;
}

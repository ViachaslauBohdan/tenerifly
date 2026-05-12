import { Metadata } from "next";
import { Suspense } from "react";
import ToursPageClient from "./client";
import {
  DEFAULT_OG_IMAGE,
  SEO_TOURS,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

// ISR настройки - обновление каждые 6 часов
export const revalidate = 21600;

// Генерация метаданных для страницы
export async function generateMetadata(): Promise<Metadata> {
  const seo = SEO_TOURS.en;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale("en", "/tours"),
      siteName: "Tenerifly.io",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Tenerife Tours & Excursions",
        },
      ],
      locale: ogLocale("en"),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale("en", "/tours"),
      languages: hreflangAlternates("/tours"),
    },
  };
}

export default async function ToursPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToursPageClient />
    </Suspense>
  );
}

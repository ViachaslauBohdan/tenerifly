import { getAllProperties } from "@/services/ssgDataService";
import { Metadata } from "next";
import { Suspense } from "react";
import ApartmentsPageClient from "./client";
import {
  DEFAULT_OG_IMAGE,
  SEO_APARTMENTS,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

// 7 days — keep in sync with CMS_PAGE_REVALIDATE in src/config/cmsCache.ts
export const revalidate = 604800;

// Генерация метаданных для страницы
export async function generateMetadata(): Promise<Metadata> {
  const seo = SEO_APARTMENTS.en;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale("en", "/apartments"),
      siteName: "Tenerifly.io",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Tenerife Stays",
        },
      ],
      locale: ogLocale("en"),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale("en", "/apartments"),
      languages: hreflangAlternates("/apartments"),
    },
  };
}

export default async function ApartmentsPage() {
  try {
    // Получаем все данные апартаментов на сервере для SSG с кэшированием
    const properties = await getAllProperties();

    console.log(
      "🏠 SSG: Page loaded with",
      properties?.length || 0,
      "properties"
    );

    return (
      <Suspense fallback={null}>
        <ApartmentsPageClient initialProperties={properties} />
      </Suspense>
    );
  } catch (error) {
    console.error("❌ SSG: Error in ApartmentsPage:", error);
    // Return page with empty data to prevent build failure
    return (
      <Suspense fallback={null}>
        <ApartmentsPageClient initialProperties={[]} />
      </Suspense>
    );
  }
}

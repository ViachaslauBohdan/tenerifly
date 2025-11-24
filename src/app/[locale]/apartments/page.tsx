import { getAllProperties } from "@/services/ssgDataService";
import { Metadata } from "next";
import { Suspense } from "react";
import ApartmentsPageClient from "../../apartments/client";
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
      url: `https://tenerifly.io/${locale}/apartments`,
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife Accommodation",
        },
      ],
      locale: locale === "en" ? "en_US" : locale === "ru" ? "ru_RU" : locale === "pl" ? "pl_PL" : locale === "fr" ? "fr_FR" : locale === "uk" ? "uk_UA" : locale === "de" ? "de_DE" : "es_ES",
      type: "website",
    },
    alternates: {
      canonical: `https://tenerifly.io/${locale}/apartments`,
      languages: Object.fromEntries(
        LOCALES.map((loc) => [`${loc.code}`, `https://tenerifly.io/${loc.code}/apartments`])
      ),
    },
  };
}

export default async function ApartmentsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  try {
    // Получаем все данные апартаментов на сервере для SSG с кэшированием
    const properties = await getAllProperties();

    console.log(
      "🏠 SSG: Page loaded with",
      properties?.length || 0,
      "properties"
    );

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ApartmentsPageClient initialProperties={properties} />
      </Suspense>
    );
  } catch (error) {
    console.error("❌ SSG: Error in ApartmentsPage:", error);
    // Return page with empty data to prevent build failure
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ApartmentsPageClient initialProperties={[]} />
      </Suspense>
    );
  }
}


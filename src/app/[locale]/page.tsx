import { getHomePageData } from "@/services/ssgDataService";
import { Metadata } from "next";
import { LocalePageClient } from "../LocalePageClient";
import { LOCALES, type Locale } from "@/types/locale";

// ISR настройки - обновление каждые 6 часов
export const revalidate = 21600;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale: locale.code,
  }));
}

// Генерация метаданных для главной страницы
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localeCode = LOCALES.some((l) => l.code === locale)
    ? (locale as Locale)
    : LOCALES[0].code;
  const localeConfig = LOCALES.find((l) => l.code === localeCode) || LOCALES[0];

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
      url: `https://tenerifly.io/${localeCode}`,
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife - Canary Islands",
        },
      ],
      locale:
        localeCode === "en"
          ? "en_US"
          : localeCode === "ru"
            ? "ru_RU"
            : localeCode === "pl"
              ? "pl_PL"
              : localeCode === "fr"
                ? "fr_FR"
                : localeCode === "uk"
                  ? "uk_UA"
                  : localeCode === "de"
                    ? "de_DE"
                    : "es_ES",
      type: "website",
    },
    alternates: {
      canonical: `https://tenerifly.io/${localeCode}`,
      languages: Object.fromEntries(
        LOCALES.map((loc) => [`${loc.code}`, `https://tenerifly.io/${loc.code}`])
      ),
    },
  };
}

export default async function LocaleRootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeCode = LOCALES.some((l) => l.code === locale)
    ? (locale as Locale)
    : LOCALES[0].code;
  // Получаем данные на сервере для SSG с трансформацией
  const homeData = await getHomePageData(localeCode);

  return <LocalePageClient initialData={homeData} />;
}


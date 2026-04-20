import { getHomePageData } from "@/services/ssgDataService";
import { Metadata } from "next";
import { LocalePageClient } from "../LocalePageClient";
import { LOCALES, type Locale } from "@/types/locale";
import {
  DEFAULT_OG_IMAGE,
  SEO_HOME,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

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
  const seo = SEO_HOME[localeCode];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale(localeCode, ""),
      siteName: "Tenerifly.io",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Tenerife - Canary Islands",
        },
      ],
      locale: ogLocale(localeCode),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale(localeCode, ""),
      languages: hreflangAlternates(""),
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

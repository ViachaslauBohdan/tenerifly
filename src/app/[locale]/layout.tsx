import type { Metadata } from "next";
import "../../styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { LOCALES, type Locale } from "@/types/locale";

// ISR настройки для layout
export const revalidate = 86400; // Обновление каждые 24 часа для основного layout

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
    title: {
      default: "Tenerifly.io - Accommodation, Tours and Car Rental in Tenerife",
      template: "%s | Tenerifly.io",
    },
    description:
      "Find your perfect accommodation, tours or car rental in Tenerife. Book directly with local providers for the best prices and authentic experiences.",
    keywords: [
      "Tenerife accommodation",
      "Tenerife tours",
      "Tenerife car rental",
      "Tenerife vacation",
      "Tenerife holiday",
      "Tenerife apartments",
      "Tenerife villas",
      "Tenerife activities",
      "Tenerife sightseeing",
      "Tenerife travel",
    ],
    authors: [{ name: "Tenerifly.io" }],
    creator: "Tenerifly.io",
    publisher: "Tenerifly.io",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: "Tenerifly.io - Your Guide to Tenerife",
      description:
        "Find your perfect accommodation, tours or car rental in Tenerife. Book directly with local providers for the best prices and authentic experiences.",
      url: `https://tenerifly.io/${localeCode}`,
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerifly.io - Your Guide to Tenerife",
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
    twitter: {
      card: "summary_large_image",
      title: "Tenerifly.io - Your Guide to Tenerife",
      description:
        "Find your perfect accommodation, tours or car rental in Tenerife. Book directly with local providers for the best prices and authentic experiences.",
      images: [
        "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
      ],
      creator: "@tenerifly",
      site: "@tenerifly",
    },
    metadataBase: new URL("https://tenerifly.io"),
    alternates: {
      canonical: `https://tenerifly.io/${localeCode}`,
      languages: Object.fromEntries(
        LOCALES.map((loc) => [
          `${loc.code}`,
          `https://tenerifly.io/${loc.code}`,
        ])
      ),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale: locale.code,
  }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const localeCode = LOCALES.some((l) => l.code === locale)
    ? (locale as Locale)
    : LOCALES[0].code;

  return <>{children}</>;
}

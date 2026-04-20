import type { Metadata } from "next";
import "../../styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { LOCALES, type Locale } from "@/types/locale";
import {
  DEFAULT_OG_IMAGE,
  SEO_HOME,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

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
  const seo = SEO_HOME[localeCode];

  return {
    title: {
      default: "Tenerifly.io - Accommodation, Tours and Car Rental in Tenerife",
      template: "%s | Tenerifly.io",
    },
    description: seo.description,
    keywords: seo.keywords,
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
      description: seo.description,
      url: absoluteUrlForLocale(localeCode, ""),
      siteName: "Tenerifly.io",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Tenerifly.io - Your Guide to Tenerife",
        },
      ],
      locale: ogLocale(localeCode),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Tenerifly.io - Your Guide to Tenerife",
      description: seo.description,
      images: [DEFAULT_OG_IMAGE],
      creator: "@tenerifly",
      site: "@tenerifly",
    },
    metadataBase: new URL("https://tenerifly.io"),
    alternates: {
      canonical: absoluteUrlForLocale(localeCode, ""),
      languages: hreflangAlternates(""),
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
  return <>{children}</>;
}

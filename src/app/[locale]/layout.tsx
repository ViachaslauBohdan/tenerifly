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
  openGraphAlternateLocales,
} from "@/lib/seo";
import { SITE_BRAND, SITE_URL } from "@/lib/site";

// 7 days — keep in sync with CMS_PAGE_REVALIDATE in src/config/cmsCache.ts
export const revalidate = 604800;

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
      default:
        `${SITE_BRAND} — Tenerife holidays: apartments, car hire & tours (Canary Islands)`,
      template: `%s | ${SITE_BRAND}`,
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: `${SITE_BRAND}` }],
    creator: `${SITE_BRAND}`,
    publisher: `${SITE_BRAND}`,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale(localeCode, ""),
      siteName: SITE_BRAND,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: ogLocale(localeCode),
      alternateLocale: openGraphAlternateLocales(localeCode),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [DEFAULT_OG_IMAGE],
    },
    metadataBase: new URL(SITE_URL),
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

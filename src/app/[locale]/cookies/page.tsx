import { SITE_BRAND } from "@/lib/site";
import { Metadata } from "next";
import { Suspense } from "react";
import { CookiePolicyPage } from "@/components/cookieConsent/CookiePolicyPage";
import { LOCALES, type Locale } from "@/types/locale";
import {
  DEFAULT_OG_IMAGE,
  SEO_COOKIE_POLICY,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale: locale.code,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO_COOKIE_POLICY[locale];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: { index: true, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale(locale, "/cookies"),
      siteName: SITE_BRAND,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: ogLocale(locale),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale(locale, "/cookies"),
      languages: hreflangAlternates("/cookies"),
    },
  };
}

export default function CookiesLocalePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <CookiePolicyPage />
    </Suspense>
  );
}

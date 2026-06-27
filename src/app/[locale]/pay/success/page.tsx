import { SITE_BRAND } from "@/lib/site";
import { Metadata } from "next";
import { Suspense } from "react";
import PaySuccessPageClient from "@/app/pay/success-client";
import { LOCALES, type Locale } from "@/types/locale";
import payJson from "@/i18n/pay.json";
import {
  DEFAULT_OG_IMAGE,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

export const revalidate = 604800;

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
  const contentKey = locale === "ua" ? "uk" : locale;
  const pay = payJson[contentKey as keyof typeof payJson] ?? payJson.en;

  return {
    title: `${pay.successTitle} | ${SITE_BRAND}`,
    description: pay.successMessage,
    openGraph: {
      title: pay.successTitle,
      description: pay.successMessage,
      url: absoluteUrlForLocale(locale, "/pay/success"),
      siteName: SITE_BRAND,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: pay.successTitle,
        },
      ],
      locale: ogLocale(locale),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale(locale, "/pay/success"),
      languages: hreflangAlternates("/pay/success"),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PaySuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <PaySuccessPageClient />
    </Suspense>
  );
}

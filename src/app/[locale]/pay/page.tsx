import { SITE_BRAND } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";
// import { Suspense } from "react";
// import PayPageClient from "@/app/pay/client";
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
    title: `${pay.title} | ${SITE_BRAND}`,
    description: pay.subtitle,
    openGraph: {
      title: pay.title,
      description: pay.subtitle,
      url: absoluteUrlForLocale(locale, "/pay"),
      siteName: SITE_BRAND,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: pay.title,
        },
      ],
      locale: ogLocale(locale),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale(locale, "/pay"),
      languages: hreflangAlternates("/pay"),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function PayPage() {
  // Temporarily hide card payment page.
  notFound();
  // return (
  //   <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
  //     <PayPageClient />
  //   </Suspense>
  // );
}

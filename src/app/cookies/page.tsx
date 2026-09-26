import { SITE_BRAND } from "@/lib/site";
import { Metadata } from "next";
import { Suspense } from "react";
import { CookiePolicyPage } from "@/components/cookieConsent/CookiePolicyPage";
import {
  DEFAULT_OG_IMAGE,
  SEO_COOKIE_POLICY,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = SEO_COOKIE_POLICY.en;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: { index: true, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale("en", "/cookies"),
      siteName: SITE_BRAND,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: ogLocale("en"),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale("en", "/cookies"),
      languages: hreflangAlternates("/cookies"),
    },
  };
}

export default function CookiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <CookiePolicyPage />
    </Suspense>
  );
}

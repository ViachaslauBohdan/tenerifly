import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorTourDetail } from "@/components/AuthorTourDetail";
import {
  getAuthorTour,
  listAuthorTourIds,
} from "@/lib/authorTours";
import { absoluteUrlForLocale, hreflangAlternates, ogLocale } from "@/lib/seo";
import { SITE_BRAND } from "@/lib/site";
import { LOCALES, type Locale } from "@/types/locale";

type PageProps = {
  params: Promise<{ locale: Locale; id: string }>;
};

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    listAuthorTourIds().map((id) => ({
      locale: locale.code,
      id,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const found = getAuthorTour(locale, id);
  if (!found) return {};
  const path = `/author-tours/${id}`;
  return {
    title: `${found.tour.title} | ${SITE_BRAND}`,
    description: found.tour.summary,
    alternates: {
      canonical: absoluteUrlForLocale(locale, path),
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: found.tour.title,
      description: found.tour.summary,
      locale: ogLocale(locale),
      url: absoluteUrlForLocale(locale, path),
    },
  };
}

export default async function AuthorTourPage({ params }: PageProps) {
  const { locale, id } = await params;
  if (!getAuthorTour(locale, id)) notFound();
  return <AuthorTourDetail tourId={id} />;
}

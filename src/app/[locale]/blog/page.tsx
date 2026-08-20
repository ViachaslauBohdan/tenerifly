import { SITE_BRAND } from "@/lib/site";
import { getAllBlogs } from "@/services/ssgDataService";
import { Metadata } from "next";
import BlogPageClient from "../../blog/BlogPageClient";
import { LOCALES, type Locale } from "@/types/locale";
import { assertBlogPublic } from "@/lib/assertBlogPublic";
import { BLOG_ENABLED } from "@/lib/siteFeatures";
import {
  DEFAULT_OG_IMAGE,
  SEO_BLOG,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

// 7 days — keep in sync with CMS_PAGE_REVALIDATE in src/config/cmsCache.ts
export const revalidate = 604800;

export function generateStaticParams() {
  if (!BLOG_ENABLED) return [];
  return LOCALES.map((locale) => ({
    locale: locale.code,
  }));
}

// Генерация метаданных для страницы
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  assertBlogPublic();
  const { locale } = await params;
  const seo = SEO_BLOG[locale];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale(locale, "/blog"),
      siteName: SITE_BRAND,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Tenerife Blog",
        },
      ],
      locale: ogLocale(locale),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale(locale, "/blog"),
      languages: hreflangAlternates("/blog"),
    },
  };
}

export default async function BlogPage({
  params: _params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  assertBlogPublic();
  // Получаем все данные блогов на сервере для SSG с кэшированием
  const blogs = await getAllBlogs();

  return <BlogPageClient initialBlogs={blogs} />;
}

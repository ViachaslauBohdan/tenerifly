import { getAllBlogs } from "@/services/ssgDataService";
import { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";
import {
  DEFAULT_OG_IMAGE,
  SEO_BLOG,
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

// ISR настройки - обновление каждые 12 часов
export const revalidate = 43200;

// Генерация метаданных для страницы
export async function generateMetadata(): Promise<Metadata> {
  const seo = SEO_BLOG.en;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale("en", "/blog"),
      siteName: "Tenerifly.io",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Tenerife Blog",
        },
      ],
      locale: ogLocale("en"),
      type: "website",
    },
    alternates: {
      canonical: absoluteUrlForLocale("en", "/blog"),
      languages: hreflangAlternates("/blog"),
    },
  };
}

export default async function BlogPage() {
  // Получаем все данные блогов на сервере для SSG с кэшированием
  const blogs = await getAllBlogs();

  return <BlogPageClient initialBlogs={blogs} />;
}

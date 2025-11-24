import { getAllBlogs } from "@/services/ssgDataService";
import { Metadata } from "next";
import BlogPageClient from "../../blog/BlogPageClient";
import { LOCALES, type Locale } from "@/types/locale";

// ISR настройки - обновление каждые 12 часов
export const revalidate = 43200;

export function generateStaticParams() {
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
  const { locale } = await params;

  return {
    title: "Tenerife Blog - Travel Tips & News | Tenerifly.io",
    description:
      "Read our latest articles about Tenerife. Travel tips, local insights, and news about the Canary Islands. Discover the best places to visit and things to do in Tenerife.",
    keywords: [
      "Tenerife blog",
      "Tenerife travel tips",
      "Canary Islands blog",
      "Tenerife travel guide",
      "Tenerife news",
      "Tenerife local insights",
    ],
    openGraph: {
      title: "Tenerife Blog - Travel Tips & News | Tenerifly.io",
      description:
        "Read our latest articles about Tenerife. Travel tips, local insights, and news about the Canary Islands.",
      url: `https://tenerifly.io/${locale}/blog`,
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife Blog",
        },
      ],
      locale: locale === "en" ? "en_US" : locale === "ru" ? "ru_RU" : locale === "pl" ? "pl_PL" : locale === "fr" ? "fr_FR" : locale === "uk" ? "uk_UA" : locale === "de" ? "de_DE" : "es_ES",
      type: "website",
    },
    alternates: {
      canonical: `https://tenerifly.io/${locale}/blog`,
      languages: Object.fromEntries(
        LOCALES.map((loc) => [`${loc.code}`, `https://tenerifly.io/${loc.code}/blog`])
      ),
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  // Получаем все данные блогов на сервере для SSG с кэшированием
  const blogs = await getAllBlogs();

  return <BlogPageClient initialBlogs={blogs} />;
}


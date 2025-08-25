import { getAllBlogs } from "@/services/ssgDataService";
import { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

// ISR настройки - обновление каждые 12 часов
export const revalidate = 43200;

// Генерация метаданных для страницы
export async function generateMetadata(): Promise<Metadata> {
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
      url: "https://tenerifly.io/blog",
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife Blog",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: "https://tenerifly.io/blog",
      languages: {
        en: "https://tenerifly.io/blog",
        pl: "https://tenerifly.io/blog",
        fr: "https://tenerifly.io/blog",
        ru: "https://tenerifly.io/blog",
        uk: "https://tenerifly.io/blog",
        de: "https://tenerifly.io/blog",
        es: "https://tenerifly.io/blog",
      },
    },
  };
}

export default async function BlogPage() {
  // Получаем все данные блогов на сервере для SSG с кэшированием
  const blogs = await getAllBlogs();

  return <BlogPageClient initialBlogs={blogs} />;
}

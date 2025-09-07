import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogIds, getBlogById } from "@/services/ssgDataService";
import BlogDetailPageClient from "./BlogDetailPageClient";

// ISR настройки - обновление каждые 24 часа
export const revalidate = 86400;

// Генерация статических путей для всех блогов
export async function generateStaticParams() {
  try {
    const blogs = await getAllBlogIds();
    return blogs.map((blog: { documentId: string }) => ({
      id: blog.documentId,
    }));
  } catch (error) {
    console.error("Error generating static params for blogs:", error);
    return [];
  }
}

// Генерация метаданных для каждой страницы
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const blog = await getBlogById(id);

    if (!blog) {
      return {
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const title = blog.title || "Blog Post";
    const description =
      blog.excerpt || blog.description || "Interesting article about Tenerife";
    const imageUrl = blog.images?.[0]?.url
      ? blog.images[0].url.startsWith("http")
        ? blog.images[0].url
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${blog.images[0].url}`
      : "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";

    return {
      title: `${title} | Tenerifly.io Blog`,
      description: description,
      keywords: [
        "Tenerife blog",
        "Tenerife travel",
        "Tenerife guide",
        "Tenerife tips",
        blog.category || "travel",
        "Tenerife",
      ],
      openGraph: {
        title: title,
        description: description,
        url: `https://tenerifly.io/blog/${id}`,
        siteName: "Tenerifly.io",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://tenerifly.io/blog/${id}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for blog:", error);
    return {
      title: "Blog Post | Tenerifly.io",
      description: "Interesting article about Tenerife",
    };
  }
}

// Основная страница с SSG
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const blog = await getBlogById(id);

    if (!blog) {
      notFound();
    }

    return <BlogDetailPageClient blog={blog} />;
  } catch (error) {
    console.error("Error loading blog:", error);
    notFound();
  }
}

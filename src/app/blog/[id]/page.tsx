import { SITE_BRAND } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogIds, getBlogById } from "@/services/ssgDataService";
import BlogDetailPageClient from "./BlogDetailPageClient";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  blogPostingJsonLd,
  breadcrumbListJsonLd,
  detailJsonLdGraph,
} from "@/lib/jsonLd";
import {
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

// 7 days — keep in sync with CMS_PAGE_REVALIDATE in src/config/cmsCache.ts
export const revalidate = 604800;

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
    const categoryLabel =
      blog.category &&
      typeof blog.category === "object" &&
      blog.category !== null &&
      "name" in blog.category
        ? String((blog.category as { name: string }).name)
        : String(blog.category ?? "travel");

    return {
      title: `${title} | ${SITE_BRAND} Blog`,
      description: description,
      keywords: [
        "Tenerife blog",
        "Tenerife travel",
        "Tenerife guide",
        "Tenerife tips",
        categoryLabel,
        "Tenerife",
      ],
      authors: blog.author ? [{ name: String(blog.author) }] : undefined,
      openGraph: {
        title: title,
        description: description,
        url: absoluteUrlForLocale("en", `/blog/${id}`),
        siteName: SITE_BRAND,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: ogLocale("en"),
        type: "article",
        publishedTime:
          "publishedAt" in blog &&
          typeof (blog as { publishedAt?: string }).publishedAt === "string"
            ? (blog as { publishedAt: string }).publishedAt
            : undefined,
        modifiedTime:
          "updatedAt" in blog &&
          typeof (blog as { updatedAt?: string }).updatedAt === "string"
            ? (blog as { updatedAt: string }).updatedAt
            : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [imageUrl],
      },
      alternates: {
        canonical: absoluteUrlForLocale("en", `/blog/${id}`),
        languages: hreflangAlternates(`/blog/${id}`),
      },
    };
  } catch (error) {
    console.error("Error generating metadata for blog:", error);
    return {
      title: `Blog Post | ${SITE_BRAND}`,
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

    const title = blog.title || "Blog Post";
    const description =
      blog.excerpt || blog.description || "Interesting article about Tenerife";
    const imageUrl = blog.images?.[0]?.url
      ? blog.images[0].url.startsWith("http")
        ? blog.images[0].url
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${blog.images[0].url}`
      : "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";
    const pageUrl = absoluteUrlForLocale("en", `/blog/${id}`);
    const publishedAt =
      "publishedAt" in blog &&
      typeof (blog as { publishedAt?: string }).publishedAt === "string"
        ? (blog as { publishedAt: string }).publishedAt
        : undefined;
    const updatedAt =
      "updatedAt" in blog &&
      typeof (blog as { updatedAt?: string }).updatedAt === "string"
        ? (blog as { updatedAt: string }).updatedAt
        : undefined;
    const structuredData = detailJsonLdGraph([
      breadcrumbListJsonLd("en", [
        { kind: "home" },
        { kind: "blog" },
        { kind: "named", name: title, path: `/blog/${id}` },
      ]),
      blogPostingJsonLd({
        url: pageUrl,
        headline: title,
        description,
        image: imageUrl,
        datePublished: publishedAt,
        dateModified: updatedAt,
        authorName: blog.author ? String(blog.author) : undefined,
      }),
    ]);

    return (
      <>
        <JsonLd data={structuredData} />
        <BlogDetailPageClient blog={blog} />
      </>
    );
  } catch (error) {
    console.error("Error loading blog:", error);
    notFound();
  }
}

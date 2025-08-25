"use client";

import Image from "next/image";
import Link from "next/link";
import { getCachedImageUrl } from "@/services/universalImageCacheService";

interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content: string;
  author: string;
  featured: boolean;
  reading_time: number;
  category_name: string | null;
  tags: string | null;
  publishedAt: string;
  images?: Array<{ url: string }>;
  featured_image?: {
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  } | null;
  localizations: Array<{
    id: number;
    locale: string;
    title: string;
    description: string;
  }>;
}

interface BlogDetailPageClientProps {
  blog: BlogPost;
}

export default function BlogDetailPageClient({
  blog,
}: BlogDetailPageClientProps) {
  // Функция для получения оптимизированного URL изображения с кэшированием
  const getImageUrl = (post: BlogPost) => {
    // Приоритет: новые images -> featured_image
    if (post.images && post.images.length > 0) {
      return getCachedImageUrl(post.images[0].url, "large");
    }

    if (post.featured_image && post.featured_image.url) {
      const apiUrl =
        process.env.NEXT_PUBLIC_STRAPI_API_URL ||
        "https://tenerifly-strapi-production.up.railway.app";
      // Используем large размер если доступен, иначе medium, потом original
      if (post.featured_image.formats?.large?.url) {
        return `${apiUrl}${post.featured_image.formats.large.url}`;
      }
      if (post.featured_image.formats?.medium?.url) {
        return `${apiUrl}${post.featured_image.formats.medium.url}`;
      }
      return `${apiUrl}${post.featured_image.url}`;
    }

    // Если нет изображений, возвращаем пустую строку
    return "";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderContent = (content: string) => {
    const formattedContent = content.replace(/\n/g, "<br />");
    return (
      <div
        className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <article className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
              {/* Featured Image */}
              {getImageUrl(blog) && (
                <div className="aspect-video relative bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                  <Image
                    src={getImageUrl(blog)}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                    quality={85}
                  />
                  {blog.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        FEATURED
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-8">
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {blog.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Author: {blog.author}</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Published on {formatDate(blog.publishedAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{blog.reading_time} min read</span>
                  </div>
                </div>

                {/* Description */}
                <div className="text-xl text-gray-600 mb-8 italic border-l-4 border-blue-500 pl-6">
                  {blog.description}
                </div>

                {/* Article Content */}
                {renderContent(blog.content)}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="space-y-6">
              {/* Author Info */}
              <div className="bg-white rounded-lg shadow-sm border p-6 xl:sticky xl:top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Author
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {blog.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {blog.author}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Travel writer and blogger sharing amazing stories from
                      around the world.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

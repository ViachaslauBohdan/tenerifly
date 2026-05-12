"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { localeDisplayCode } from "@/types/locale";
import translations from "@/i18n/blog.json";
// Языки с флагами
const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  featured_image?: {
    url: string;
    alternativeText?: string;
  };
  documentId?: string;
  publishedAt: string;
  reading_time?: number;
  category?: string;
  slug?: string;
}

interface BlogPageClientProps {
  initialBlogs?: any[];
}

export default function BlogPageClient({ initialBlogs }: BlogPageClientProps) {
  const { locale, switchLocale, createLocaleLink } = useTranslation();
  const [language, setLanguage] = useState<
    "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  >(locale as "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogs || []);
  const [loading, setLoading] = useState(!initialBlogs);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];
  const currentLanguage = languages.find((lang) => lang.code === language);

  // Синхронизируем язык с URL
  useEffect(() => {
    setLanguage(locale as "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es");
  }, [locale]);

  // Загрузка блогов только если нет initialBlogs
  useEffect(() => {
    if (initialBlogs) {
      setBlogPosts(initialBlogs);
      setLoading(false);
      return;
    }

    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL ||
          "https://tenerifly-strapi-production.up.railway.app";
        const response = await fetch(
          `${apiUrl}/api/blog-posts?populate=*&locale=${language}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.data) {
          setBlogPosts(data.data);
        } else {
          setBlogPosts([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [language, initialBlogs]);

  // Переключение языка через URL
  const handleLanguageChange = (
    langCode: "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  ) => {
    switchLocale(langCode);
    setIsLanguageDropdownOpen(false);
  };

  const getCategoryText = (category: string | null) => {
    if (!category) return t.noCategory;

    const lowerCategory = category.toLowerCase();
    return t.categories[lowerCategory as keyof typeof t.categories] || category;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    const apiUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL ||
      "https://tenerifly-strapi-production.up.railway.app";
    return `${apiUrl}${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900">{t.loading}</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t.errorLoading}
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with Language Switcher */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href={createLocaleLink("/")}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
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
            {t.backToHome}
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <span className="text-xl">{currentLanguage?.flag}</span>
              <span className="font-medium text-gray-700 hidden sm:block">
                {currentLanguage?.name}
              </span>
              <span className="font-medium text-gray-700 sm:hidden">
                {localeDisplayCode(currentLanguage?.code)}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isLanguageDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    {t.selectLanguage}
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() =>
                        handleLanguageChange(
                          lang.code as
                            | "en"
                            | "ru"
                            | "pl"
                            | "fr"
                            | "uk"
                            | "de"
                            | "es"
                        )
                      }
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${
                        language === lang.code
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {language === lang.code && (
                        <svg
                          className="w-4 h-4 ml-auto text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.blog.title}
          </h1>
          <p className="text-xl text-gray-600">{t.blog.subtitle}</p>
        </div>

        {/* Blog Posts Grid */}
        {blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t.noBlogPosts}
            </h2>
            <p className="text-gray-600">{t.noBlogPostsDescription}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Blog Post Image */}
                {post.featured_image && (
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={getImageUrl(post.featured_image.url)}
                      alt={post.featured_image.alternativeText || post.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Blog Post Content */}
                <div className="p-6">
                  {/* Category */}
                  {post.category && (
                    <div className="mb-3">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {getCategoryText(post.category)}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span>{post.author}</span>
                      {post.reading_time && (
                        <span>
                          {post.reading_time} {t.minRead}
                        </span>
                      )}
                    </div>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>

                  {/* Read More Button */}
                  <Link
                    href={createLocaleLink(`/blog/${post.documentId}`)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    {t.readMore}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Click outside to close dropdown */}
        {isLanguageDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsLanguageDropdownOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { Calendar, Clock, Star, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { HomeCardImage } from "@/components/HomeCardImage";
import { HomeEmptyState } from "@/components/home/HomeEmptyState";
import { ViewAllLink } from "@/components/ViewAllLink";
import type { HomeBlogPost } from "@/types/homeListings";
import translationsJson from "@/i18n/main.json";

type BlogCopy = (typeof translationsJson)["en"]["sections"]["blog"];
type CommonCopy = (typeof translationsJson)["en"]["common"];

type HomeBlogSectionProps = {
  items: HomeBlogPost[];
  dataLoading: boolean;
  copy: BlogCopy;
  common: CommonCopy;
  blogHref: string;
  createLocaleLink: (path: string) => string;
};

export function HomeBlogSection({
  items,
  dataLoading,
  copy,
  common,
  blogHref,
  createLocaleLink,
}: HomeBlogSectionProps) {
  const router = useRouter();
  const previewItems = items.slice(0, 3);

  return (
    <section
      id="blog"
      className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16 sm:flex-row sm:justify-between sm:items-center">
          <div className="min-w-0 w-full text-center sm:flex-1">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {copy.title}
            </h2>
            <p className="text-xl text-gray-600">{copy.subtitle}</p>
          </div>
          <ViewAllLink href={blogHref}>{copy.viewAll}</ViewAllLink>
        </div>

        {dataLoading ? (
          <HomeEmptyState
            type="loading"
            serverErrorLabel={common.serverError}
            noDataLabel={common.noData}
          />
        ) : previewItems.length === 0 ? (
          <HomeEmptyState
            type="empty"
            serverErrorLabel={common.serverError}
            noDataLabel={common.noData}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewItems.map((post) => {
              const detailHref = createLocaleLink(
                `/blog/${post.documentId || post.id}`
              );
              return (
                <div
                  key={post.documentId || post.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <HomeCardImage
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      onClick={() => router.push(detailHref)}
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        type="button"
                        onClick={() => router.push(detailHref)}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 sm:hidden"
                        aria-label={common.readMore}
                      >
                        <svg
                          className="w-4 h-4 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-yellow-700">
                          {post.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>
                          {copy.author}: {post.author}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {copy.readTime}: {post.readTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {copy.publishedDate}: {post.publishedDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => router.push(detailHref)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {common.readMore}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

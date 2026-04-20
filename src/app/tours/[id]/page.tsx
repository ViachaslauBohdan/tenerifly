import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTourIds, getTourById } from "@/services/ssgDataService";
import TourDetailPageClient from "./client";
import {
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

// ISR настройки - обновление каждые 24 часа
export const revalidate = 86400;

// Генерация статических путей для всех туров
export async function generateStaticParams() {
  try {
    const tours = await getAllTourIds();
    return tours.map((tour: { documentId: string }) => ({
      id: tour.documentId,
    }));
  } catch (error) {
    console.error("Error generating static params for tours:", error);
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
    const tour = await getTourById(id);

    if (!tour) {
      return {
        title: "Tour Not Found",
        description: "The requested tour could not be found.",
      };
    }

    const title = tour.name || tour.title || "Tour";
    const description = tour.description || "Amazing tour in Tenerife";
    const imageUrl = tour.images?.[0]?.url
      ? tour.images[0].url.startsWith("http")
        ? tour.images[0].url
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${tour.images[0].url}`
      : "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";

    return {
      title: `${title} | Tenerifly.io Tours`,
      description: description,
      keywords: [
        "Tenerife tours",
        "Tenerife excursions",
        "Tenerife activities",
        "Tenerife travel",
        tour.category || "tour",
        "Tenerife",
      ],
      openGraph: {
        title: title,
        description: description,
        url: absoluteUrlForLocale("en", `/tours/${id}`),
        siteName: "Tenerifly.io",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: ogLocale("en"),
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [imageUrl],
      },
      alternates: {
        canonical: absoluteUrlForLocale("en", `/tours/${id}`),
        languages: hreflangAlternates(`/tours/${id}`),
      },
    };
  } catch (error) {
    console.error("Error generating metadata for tour:", error);
    return {
      title: "Tour | Tenerifly.io",
      description: "Amazing tour in Tenerife",
    };
  }
}

// Основная страница с SSG
export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const tour = await getTourById(id);

    if (!tour) {
      notFound();
    }

    return <TourDetailPageClient tour={tour} />;
  } catch (error) {
    console.error("Error loading tour:", error);
    notFound();
  }
}

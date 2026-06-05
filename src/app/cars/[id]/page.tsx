import { SITE_BRAND } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCarIds, getCarById } from "@/services/ssgDataService";
import CarDetailPageClient from "./client";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbListJsonLd,
  detailJsonLdGraph,
  productOfferJsonLd,
} from "@/lib/jsonLd";
import {
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

// 7 days — keep in sync with CMS_PAGE_REVALIDATE in src/config/cmsCache.ts
export const revalidate = 604800;

// Генерация статических путей для всех машин
export async function generateStaticParams() {
  try {
    const cars = await getAllCarIds();
    return cars.map((car: { documentId: string }) => ({
      id: car.documentId,
    }));
  } catch (error) {
    console.error("Error generating static params for cars:", error);
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
    const car = await getCarById(id);

    if (!car) {
      return {
        title: "Car Not Found",
        description: "The requested car could not be found.",
      };
    }

    const title =
      car.title ||
      `${car.specifications?.make || "Car"} ${car.specifications?.model || ""}`.trim();
    const description =
      car.description || "Reliable car for your journey in Tenerife";
    const imageUrl = car.images?.[0]?.url
      ? car.images[0].url.startsWith("http")
        ? car.images[0].url
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${car.images[0].url}`
      : "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";

    return {
      title: `${title} | ${SITE_BRAND} Cars`,
      description: description,
      keywords: [
        "Tenerife car rental",
        "Tenerife car hire",
        "Tenerife vehicles",
        "Tenerife transport",
        car.specifications?.make || "car",
        car.specifications?.model || "vehicle",
        "Tenerife",
      ],
      openGraph: {
        title: title,
        description: description,
        url: absoluteUrlForLocale("en", `/cars/${id}`),
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
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [imageUrl],
      },
      alternates: {
        canonical: absoluteUrlForLocale("en", `/cars/${id}`),
        languages: hreflangAlternates(`/cars/${id}`),
      },
    };
  } catch (error) {
    console.error("Error generating metadata for car:", error);
    return {
      title: `Car | ${SITE_BRAND}`,
      description: "Reliable car for your journey in Tenerife",
    };
  }
}

// Основная страница с SSG
export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const car = await getCarById(id);

    if (!car) {
      notFound();
    }

    const title =
      car.title ||
      `${car.specifications?.make || "Car"} ${car.specifications?.model || ""}`.trim();
    const imageUrl = car.images?.[0]?.url
      ? car.images[0].url.startsWith("http")
        ? car.images[0].url
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${car.images[0].url}`
      : "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";
    const pageUrl = absoluteUrlForLocale("en", `/cars/${id}`);
    const dayRate =
      typeof (car as { rental_prices?: { day_1?: number } }).rental_prices
        ?.day_1 === "number"
        ? (car as { rental_prices: { day_1: number } }).rental_prices.day_1
        : undefined;
    const structuredData = detailJsonLdGraph([
      breadcrumbListJsonLd("en", [
        { kind: "home" },
        { kind: "cars" },
        { kind: "named", name: title, path: `/cars/${id}` },
      ]),
      productOfferJsonLd({
        url: pageUrl,
        name: title,
        description: String(car.description || ""),
        image: imageUrl,
        price: dayRate,
        priceCurrency: "EUR",
      }),
    ]);

    return (
      <>
        <JsonLd data={structuredData} />
        <CarDetailPageClient car={car} />
      </>
    );
  } catch (error) {
    console.error("Error loading car:", error);
    notFound();
  }
}

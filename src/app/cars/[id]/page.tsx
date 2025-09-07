import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCarIds, getCarById } from "@/services/ssgDataService";
import CarDetailPageClient from "./client";

// ISR настройки - обновление каждые 24 часа
export const revalidate = 86400;

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
      title: `${title} | Tenerifly.io Cars`,
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
        url: `https://tenerifly.io/cars/${id}`,
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
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://tenerifly.io/cars/${id}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for car:", error);
    return {
      title: "Car | Tenerifly.io",
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

    return <CarDetailPageClient car={car} />;
  } catch (error) {
    console.error("Error loading car:", error);
    notFound();
  }
}

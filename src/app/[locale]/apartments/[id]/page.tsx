import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPropertyIds, getPropertyById } from "@/services/ssgDataService";
import PropertyDetailPageClient from "../../../apartments/[id]/PropertyDetailPageClient";
import { LOCALES, type Locale } from "@/types/locale";
import {
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

// ISR настройки - обновление каждые 24 часа
export const revalidate = 86400;

// Генерация статических путей для всех апартаментов
export async function generateStaticParams() {
  try {
    const properties = await getAllPropertyIds();
    const locales = LOCALES.map((l) => l.code);

    return properties.flatMap((property: { documentId: string }) =>
      locales.map((locale) => ({
        locale,
        id: property.documentId,
      }))
    );
  } catch (error) {
    console.error("Error generating static params for properties:", error);
    return [];
  }
}

// Генерация метаданных для каждой страницы
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}): Promise<Metadata> {
  try {
    const { locale, id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
      return {
        title: "Property Not Found",
        description: "The requested property could not be found.",
      };
    }

    const title = property.title || "Property Details";
    const description =
      property.description || "Beautiful property in Tenerife";
    const imageUrl = property.images?.[0]?.url
      ? property.images[0].url.startsWith("http")
        ? property.images[0].url
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${property.images[0].url}`
      : "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";

    return {
      title: `${title} | Tenerifly.io`,
      description: description,
      keywords: [
        "Tenerife accommodation",
        "Tenerife property",
        "Tenerife apartment",
        "Tenerife villa",
        "Tenerife rental",
        "Tenerife vacation rental",
        property.location?.city || "Tenerife",
        property.category || "property",
      ],
      openGraph: {
        title: title,
        description: description,
        url: absoluteUrlForLocale(locale, `/apartments/${id}`),
        siteName: "Tenerifly.io",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: ogLocale(locale),
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [imageUrl],
      },
      alternates: {
        canonical: absoluteUrlForLocale(locale, `/apartments/${id}`),
        languages: hreflangAlternates(`/apartments/${id}`),
      },
    };
  } catch (error) {
    console.error("Error generating metadata for property:", error);
    return {
      title: "Property Details | Tenerifly.io",
      description: "Beautiful property in Tenerife",
    };
  }
}

// Основная страница с SSG
export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
      notFound();
    }

    return <PropertyDetailPageClient property={property} />;
  } catch (error) {
    console.error("Error loading property:", error);
    notFound();
  }
}


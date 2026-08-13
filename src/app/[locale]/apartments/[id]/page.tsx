import { SITE_BRAND } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPropertyIds, getPropertyById } from "@/services/ssgDataService";
import PropertyDetailPageClient from "../../../apartments/[id]/PropertyDetailPageClient";
import { LOCALES, type Locale } from "@/types/locale";
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
    const property = await getPropertyById(id, locale);

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
      title: `${title} | ${SITE_BRAND}`,
      description: description,
      keywords: [
        "Tenerife stays",
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
        siteName: SITE_BRAND,
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
      title: `Property Details | ${SITE_BRAND}`,
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
    const { id, locale } = await params;
    const property = await getPropertyById(id, locale);

    if (!property) {
      notFound();
    }

    const title = property.title || "Property Details";
    const imageUrl = property.images?.[0]?.url
      ? property.images[0].url.startsWith("http")
        ? property.images[0].url
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${property.images[0].url}`
      : "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";
    const pageUrl = absoluteUrlForLocale(locale, `/apartments/${id}`);
    const structuredData = detailJsonLdGraph([
      breadcrumbListJsonLd(locale, [
        { kind: "home" },
        { kind: "apartments" },
        { kind: "named", name: title, path: `/apartments/${id}` },
      ]),
      productOfferJsonLd({
        url: pageUrl,
        name: title,
        description: String(property.description || ""),
        image: imageUrl,
        price: property.price?.amount,
        priceCurrency: property.price?.currency,
      }),
    ]);

    return (
      <>
        <JsonLd data={structuredData} />
        <PropertyDetailPageClient property={property} />
      </>
    );
  } catch (error) {
    console.error("Error loading property:", error);
    notFound();
  }
}


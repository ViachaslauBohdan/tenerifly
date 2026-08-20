import { SITE_BRAND } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTourIds, getTourById } from "@/services/ssgDataService";
import TourDetailPageClient from "./client";
import { AtlanticoTourDetail } from "@/components/atlantico/AtlanticoTourDetail";
import {
  atlanticoTourSeo,
  listAtlanticoTourCodes,
  tryLoadAtlanticoTour,
} from "@/lib/atlantico/resolveTour";
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

export const revalidate = 1800;

export async function generateStaticParams() {
  try {
    const [strapiTours, atlanticoCodes] = await Promise.all([
      getAllTourIds().catch(() => []),
      listAtlanticoTourCodes(),
    ]);
    return [
      ...atlanticoCodes.map((id) => ({ id })),
      ...strapiTours.map((tour: { documentId: string }) => ({
        id: tour.documentId,
      })),
    ];
  } catch (error) {
    console.error("Error generating static params for tours:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const atlantico = await tryLoadAtlanticoTour(id, "en");
    if (atlantico) {
      const seo = atlanticoTourSeo(atlantico.tour);
      return {
        title: `${seo.title} | ${SITE_BRAND} Tours`,
        description: seo.description,
        openGraph: {
          title: seo.title,
          description: seo.description,
          url: absoluteUrlForLocale("en", `/tours/${id}`),
          siteName: SITE_BRAND,
          images: [
            { url: seo.imageUrl, width: 1200, height: 630, alt: seo.title },
          ],
          locale: ogLocale("en"),
          type: "website",
        },
        alternates: {
          canonical: absoluteUrlForLocale("en", `/tours/${id}`),
          languages: hreflangAlternates(`/tours/${id}`),
        },
      };
    }

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
      title: `${title} | ${SITE_BRAND} Tours`,
      description: description,
      keywords: [
        "Tenerife tours",
        "Tenerife activities",
        "Tenerife travel",
        String(tour.category ?? "tour"),
        "Tenerife",
      ],
      openGraph: {
        title: title,
        description: description,
        url: absoluteUrlForLocale("en", `/tours/${id}`),
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
        canonical: absoluteUrlForLocale("en", `/tours/${id}`),
        languages: hreflangAlternates(`/tours/${id}`),
      },
    };
  } catch (error) {
    console.error("Error generating metadata for tour:", error);
    return {
      title: `Tour | ${SITE_BRAND}`,
      description: "Amazing tour in Tenerife",
    };
  }
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const atlantico = await tryLoadAtlanticoTour(id, "en");
    if (atlantico) {
      const seo = atlanticoTourSeo(atlantico.tour);
      const pageUrl = absoluteUrlForLocale("en", `/tours/${id}`);
      const structuredData = detailJsonLdGraph([
        breadcrumbListJsonLd("en", [
          { kind: "home" },
          { kind: "tours" },
          { kind: "named", name: seo.title, path: `/tours/${id}` },
        ]),
        productOfferJsonLd({
          url: pageUrl,
          name: seo.title,
          description: seo.description,
          image: seo.imageUrl,
          price: seo.price,
          priceCurrency: "EUR",
        }),
      ]);
      return (
        <>
          <JsonLd data={structuredData} />
          <AtlanticoTourDetail
            tour={atlantico.tour}
            events={atlantico.events}
          />
        </>
      );
    }

    const tour = await getTourById(id);

    if (!tour) {
      notFound();
    }

    const title = tour.name || tour.title || "Tour";
    const imageUrl = tour.images?.[0]?.url
      ? tour.images[0].url.startsWith("http")
        ? tour.images[0].url
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${tour.images[0].url}`
      : "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";
    const pageUrl = absoluteUrlForLocale("en", `/tours/${id}`);
    const structuredData = detailJsonLdGraph([
      breadcrumbListJsonLd("en", [
        { kind: "home" },
        { kind: "tours" },
        { kind: "named", name: title, path: `/tours/${id}` },
      ]),
      productOfferJsonLd({
        url: pageUrl,
        name: title,
        description: String(tour.description || ""),
        image: imageUrl,
        price: tour.price?.amount,
        priceCurrency: tour.price?.currency,
      }),
    ]);

    return (
      <>
        <JsonLd data={structuredData} />
        <TourDetailPageClient tour={tour as any} />
      </>
    );
  } catch (error) {
    console.error("Error loading tour:", error);
    notFound();
  }
}

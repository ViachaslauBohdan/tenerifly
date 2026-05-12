import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllTransferIds,
  getTransferById,
} from "@/services/ssgDataService";
import TransferDetailPageClient from "../../../transfers/[id]/client";
import { getTransferImage } from "@/lib/transfers";
import { LOCALES, type Locale } from "@/types/locale";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbListJsonLd,
  detailJsonLdGraph,
  serviceTransferJsonLd,
} from "@/lib/jsonLd";
import {
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const transfers = await getAllTransferIds();
    return transfers.flatMap((transfer: { documentId: string }) =>
      LOCALES.map((locale) => ({
        locale: locale.code,
        id: transfer.documentId,
      }))
    );
  } catch (error) {
    console.error("Error generating static params for transfers:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}): Promise<Metadata> {
  try {
    const { locale, id } = await params;
    const transfer = await getTransferById(id);
    const title = transfer.title || "Airport transfer";
    const description =
      transfer.description || "Private airport transfer in Tenerife";
    const imageUrl = getTransferImage(transfer);

    return {
      title: `${title} | Tenerifly.io Transfers`,
      description,
      keywords: [
        "Tenerife airport transfer",
        "Tenerife South Airport transfer",
        "Tenerife North Airport transfer",
        "private transfer Tenerife",
        "Canary Islands transfer",
      ],
      openGraph: {
        title,
        description,
        url: absoluteUrlForLocale(locale, `/transfers/${id}`),
        siteName: "Tenerifly.io",
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
        locale: ogLocale(locale),
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: absoluteUrlForLocale(locale, `/transfers/${id}`),
        languages: hreflangAlternates(`/transfers/${id}`),
      },
    };
  } catch (error) {
    return {
      title: "Airport Transfer | Tenerifly.io",
      description: "Private airport transfer in Tenerife",
    };
  }
}

export default async function TransferDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  try {
    const { id, locale } = await params;
    const transfer = await getTransferById(id);

    if (!transfer) {
      notFound();
    }

    const title = transfer.title || "Airport transfer";
    const description =
      transfer.description || "Private airport transfer in Tenerife";
    const imageUrl = getTransferImage(transfer);
    const pageUrl = absoluteUrlForLocale(locale, `/transfers/${id}`);
    const low = Math.min(
      transfer.price_south_airport,
      transfer.price_north_airport
    );
    const high = Math.max(
      transfer.price_south_airport,
      transfer.price_north_airport
    );
    const structuredData = detailJsonLdGraph([
      breadcrumbListJsonLd(locale, [
        { kind: "home" },
        { kind: "named", name: title, path: `/transfers/${id}` },
      ]),
      serviceTransferJsonLd({
        url: pageUrl,
        name: title,
        description,
        image: imageUrl,
        lowPrice: low,
        highPrice: high,
        priceCurrency: transfer.currency || "EUR",
      }),
    ]);

    return (
      <>
        <JsonLd data={structuredData} />
        <TransferDetailPageClient transfer={transfer} />
      </>
    );
  } catch (error) {
    console.error("Error loading transfer:", error);
    notFound();
  }
}

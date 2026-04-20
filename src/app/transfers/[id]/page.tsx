import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllTransferIds,
  getTransferById,
} from "@/services/ssgDataService";
import TransferDetailPageClient from "./client";
import { getTransferImage } from "@/lib/transfers";
import {
  absoluteUrlForLocale,
  hreflangAlternates,
  ogLocale,
} from "@/lib/seo";

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const transfers = await getAllTransferIds();
    return transfers.map((transfer: { documentId: string }) => ({
      id: transfer.documentId,
    }));
  } catch (error) {
    console.error("Error generating static params for transfers:", error);
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
    const transfer = await getTransferById(id);
    const title = transfer.title || "Airport transfer";
    const description =
      transfer.description || "Private airport transfer in Tenerife";
    const imageUrl = getTransferImage(transfer);

    return {
      title: `${title} | Tenerifly.io Transfers`,
      description,
      openGraph: {
        title,
        description,
        url: absoluteUrlForLocale("en", `/transfers/${id}`),
        siteName: "Tenerifly.io",
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
        locale: ogLocale("en"),
        type: "website",
      },
      alternates: {
        canonical: absoluteUrlForLocale("en", `/transfers/${id}`),
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
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const transfer = await getTransferById(id);

    if (!transfer) {
      notFound();
    }

    return <TransferDetailPageClient transfer={transfer} />;
  } catch (error) {
    console.error("Error loading transfer:", error);
    notFound();
  }
}

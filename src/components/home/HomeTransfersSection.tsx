"use client";

import Link from "next/link";
import { Plane, Users } from "lucide-react";
import { HomeCardImage } from "@/components/HomeCardImage";
import { ViewDetailsLink } from "@/components/ViewDetailsLink";
import {
  formatTransferPrice,
  getTransferImage,
  getTransferLocaleText,
  localizeTransfer,
  type Transfer,
} from "@/lib/transfers";
import type { BookingItem, LanguageCode } from "@/components/home/types";

type HomeTransfersSectionProps = {
  transfers: Transfer[];
  language: LanguageCode;
  createLocaleLink: (path: string) => string;
  onBook: (item: BookingItem) => void;
};

export function HomeTransfersSection({
  transfers,
  language,
  createLocaleLink,
  onBook,
}: HomeTransfersSectionProps) {
  if (transfers.length === 0) return null;

  const transferCopy = getTransferLocaleText(language);

  return (
    <section
      id="transfers"
      className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {transferCopy.sectionTitle}
          </h2>
          <p className="text-xl text-gray-600">
            {transferCopy.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {transfers.slice(0, 2).map((rawTransfer) => {
            const transfer = localizeTransfer(rawTransfer, language);
            const transferDetailHref = createLocaleLink(
              `/transfers/${transfer.documentId}`
            );

            return (
              <div
                key={transfer.documentId || transfer.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <Link
                  href={transferDetailHref}
                  prefetch
                  className="block aspect-video relative overflow-hidden bg-gray-100 group"
                >
                  <HomeCardImage
                    src={getTransferImage(transfer)}
                    alt={transfer.title}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {transfer.title}
                      </h3>
                      <div className="mt-2 inline-flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>
                          {transfer.seats} {transferCopy.seats}
                        </span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700">
                      <Plane className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {transferCopy.from}{" "}
                        {formatTransferPrice(transfer, "south")}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-5 line-clamp-2">
                    {transfer.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="text-sm text-gray-500 mb-1">
                        {transferCopy.southAirport}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatTransferPrice(transfer, "south")}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="text-sm text-gray-500 mb-1">
                        {transferCopy.northAirport}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatTransferPrice(transfer, "north")}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ViewDetailsLink href={transferDetailHref}>
                      {transferCopy.viewDetails}
                    </ViewDetailsLink>
                    <button
                      type="button"
                      onClick={() =>
                        onBook({
                          title: transfer.title,
                          price: `${transferCopy.southAirport}: ${formatTransferPrice(
                            transfer,
                            "south"
                          )}, ${transferCopy.northAirport}: ${formatTransferPrice(
                            transfer,
                            "north"
                          )}`,
                          contact: transfer.contact,
                        })
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {transferCopy.bookNow}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

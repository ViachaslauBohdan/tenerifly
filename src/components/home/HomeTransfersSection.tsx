"use client";

import Link from "next/link";
import { Plane, Users } from "lucide-react";
import { HomeCardImage } from "@/components/HomeCardImage";
import { ViewDetailsLink } from "@/components/ViewDetailsLink";
import {
  formatTransferPrice,
  getTransferImage,
  getTransferLocaleText,
  homeBusHasBothSizes,
  isPassengerRenault,
  localizeTransfer,
  pickHomeBusTransfer,
  resolveTransferMediaUrl,
  type Transfer,
} from "@/lib/transfers";
import type { BookingItem, HomeCar, LanguageCode } from "@/components/home/types";

type HomeTransfersSectionProps = {
  transfers: Transfer[];
  cars?: HomeCar[];
  language: LanguageCode;
  createLocaleLink: (path: string) => string;
  onBook: (item: BookingItem) => void;
};

export function HomeTransfersSection({
  transfers,
  cars = [],
  language,
  createLocaleLink,
  onBook,
}: HomeTransfersSectionProps) {
  const renault = cars.find(isPassengerRenault) ?? null;
  const bus = pickHomeBusTransfer(transfers);
  const bothSizes = homeBusHasBothSizes(transfers);
  if (!renault && !bus && transfers.length === 0) return null;

  const transferCopy = getTransferLocaleText(language);
  const renaultImage = renault?.images?.[0]?.url
    ? resolveTransferMediaUrl(renault.images[0].url)
    : "";
  const renaultSeats = renault?.specifications?.seats;

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

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          {renault ? (
            <div className="flex h-full flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link
                href={createLocaleLink(`/cars/${renault.documentId}`)}
                prefetch
                className="block aspect-video relative overflow-hidden bg-gray-100 group"
              >
                <HomeCardImage
                  src={renaultImage}
                  alt={renault.title}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {renault.title}
                    </h3>
                    {renaultSeats ? (
                      <div className="mt-2 inline-flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>
                          {renaultSeats} {transferCopy.seats}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  {bus ? (
                    <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700">
                      <Plane className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {transferCopy.from} {formatTransferPrice(bus, "south")}
                      </span>
                    </div>
                  ) : null}
                </div>
                <p className="mb-5 line-clamp-2 text-sm text-gray-600">
                  {renault.description}
                </p>
                {bus ? (
                  <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-1 text-sm text-gray-500">
                        {transferCopy.southAirport}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatTransferPrice(bus, "south")}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-1 text-sm text-gray-500">
                        {transferCopy.northAirport}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatTransferPrice(bus, "north")}
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ViewDetailsLink
                    href={createLocaleLink(`/cars/${renault.documentId}`)}
                  >
                    {transferCopy.viewDetails}
                  </ViewDetailsLink>
                  <button
                    type="button"
                    onClick={() =>
                      onBook({
                        title: renault.title,
                        price: bus
                          ? `${transferCopy.southAirport}: ${formatTransferPrice(
                              bus,
                              "south"
                            )}, ${transferCopy.northAirport}: ${formatTransferPrice(
                              bus,
                              "north"
                            )}`
                          : undefined,
                      })
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {transferCopy.bookNow}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
          {(bus ? [bus] : transfers.slice(0, 1)).map((rawTransfer) => {
            const transfer = localizeTransfer(rawTransfer, language);
            const transferDetailHref = createLocaleLink(
              `/transfers/${transfer.documentId}`
            );

            return (
              <div
                key={transfer.documentId || transfer.id}
                className="flex h-full flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
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
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {transfer.title}
                      </h3>
                      <div className="mt-2 inline-flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>
                          {bothSizes
                            ? transferCopy.bothSeats
                            : `${transfer.seats} ${transferCopy.seats}`}
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

                  <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
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

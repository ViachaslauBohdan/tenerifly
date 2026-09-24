"use client";

import { useState } from "react";
import Link from "next/link";
import { IconBrandTelegram, IconBrandWhatsapp } from "@tabler/icons-react";
import { ApartmentManagerContactPopup } from "@/components/ApartmentManagerContactPopup";
import { HomeCardImage } from "@/components/HomeCardImage";
import { TilePriceBadge } from "@/components/TilePriceBadge";
import type { BookingItem, LanguageCode } from "@/components/home/types";
import { getApartmentBookingCopy } from "@/lib/apartmentBookingCopy";
import {
  formatAuthorTourPrice,
  getAuthorTourBundle,
  getAuthorTourImageSrc,
} from "@/lib/authorTours";

type HomeAuthorToursSectionProps = {
  language: LanguageCode;
  onBook: (item: BookingItem) => void;
};

export function HomeAuthorToursSection({
  language,
  onBook,
}: HomeAuthorToursSectionProps) {
  const { ui, tours } = getAuthorTourBundle(language);
  const requestCopy = getApartmentBookingCopy(language);
  const [managerOpen, setManagerOpen] = useState(false);
  const [managerTitle, setManagerTitle] = useState("");

  return (
    <section
      id="author-tours"
      className="scroll-mt-[6.5rem] bg-white py-20 md:scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {ui.sectionTitle}
          </h2>
          <p className="mt-3 text-gray-600">{ui.sectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => {
            const price = formatAuthorTourPrice(tour.priceEur);
            return (
              <article
                key={tour.id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <Link
                  href={`/${language}/author-tours/${tour.id}`}
                  className="relative block aspect-video overflow-hidden"
                >
                  <HomeCardImage
                    src={getAuthorTourImageSrc(tour.id)}
                    alt={tour.title}
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    <Link href={`/${language}/author-tours/${tour.id}`}>
                      {tour.title}
                    </Link>
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                    {tour.summary}
                  </p>
                  <ul className="mb-4 space-y-2 text-sm text-gray-600">
                    {tour.highlights.slice(0, 2).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="mb-4">
                    <TilePriceBadge>
                      <span className="text-sm font-semibold tabular-nums text-yellow-900">
                        {price}
                      </span>
                      <span className="text-sm font-medium text-yellow-700">
                        {ui.perPerson}
                      </span>
                    </TilePriceBadge>
                  </div>
                  <details className="mb-6 text-sm text-gray-700">
                    <summary className="cursor-pointer font-medium text-gray-900">
                      {ui.programLabel}
                    </summary>
                    <p className="mt-2 text-xs text-gray-500">{ui.placesNote}</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-5">
                      {tour.program.map((day) => (
                        <li key={day}>{day}</li>
                      ))}
                    </ol>
                    <p className="mb-1 mt-3 font-medium text-gray-900">
                      {ui.includedLabel}
                    </p>
                    <ul className="space-y-1 text-gray-600">
                      {tour.included.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className="mb-1 mt-3 font-medium text-gray-900">
                      {ui.excludedLabel}
                    </p>
                    <ul className="space-y-1 text-gray-600">
                      {tour.excluded.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </details>
                  <div className="mt-auto flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onBook({
                          title: tour.title,
                          price: `${price} ${ui.perPerson}`,
                        })
                      }
                      className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                      {requestCopy.checkPrice}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setManagerTitle(tour.title);
                        setManagerOpen(true);
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-white transition-colors hover:bg-[#1ebe57]"
                    >
                      <IconBrandWhatsapp className="h-4 w-4 shrink-0" stroke={2} />
                      <IconBrandTelegram className="h-4 w-4 shrink-0" stroke={2} />
                      {requestCopy.contactManager}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {managerOpen && (
        <ApartmentManagerContactPopup
          opened={managerOpen}
          onClose={() => setManagerOpen(false)}
          propertyTitle={managerTitle}
          locale={language}
        />
      )}
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { IconBrandTelegram, IconBrandWhatsapp } from "@tabler/icons-react";
import { ApartmentManagerContactPopup } from "@/components/ApartmentManagerContactPopup";
import { CatalogDetailShell } from "@/components/CatalogDetailShell";
import { DeferredSimpleBookingPopup } from "@/components/DeferredSimpleBookingPopup";
import { HomeCardImage } from "@/components/HomeCardImage";
import { TilePriceBadge } from "@/components/TilePriceBadge";
import { useTranslation } from "@/hooks/useTranslation";
import { getApartmentBookingCopy } from "@/lib/apartmentBookingCopy";
import {
  formatAuthorTourPrice,
  getAuthorTour,
  getAuthorTourImageSrc,
} from "@/lib/authorTours";
import type { Locale } from "@/types/locale";

type AuthorTourDetailProps = {
  tourId: string;
};

export function AuthorTourDetail({ tourId }: AuthorTourDetailProps) {
  const { locale, createLocaleLink } = useTranslation();
  const found = getAuthorTour(locale, tourId);
  const requestCopy = getApartmentBookingCopy(locale);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);

  if (!found) {
    return (
      <CatalogDetailShell>
        <p className="text-gray-600">Tour not found.</p>
      </CatalogDetailShell>
    );
  }

  const { ui, tour } = found;
  const price = formatAuthorTourPrice(tour.priceEur);
  const priceLabel = `${price} ${ui.perPerson}`;

  return (
    <CatalogDetailShell>
      <Link
        href={createLocaleLink("/#author-tours")}
        className="mb-6 inline-block text-sm font-medium text-blue-700 hover:text-blue-800"
      >
        {ui.backLabel}
      </Link>

      <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="relative aspect-video">
          <HomeCardImage
            src={getAuthorTourImageSrc(tour.id)}
            alt={tour.title}
          />
        </div>
        <div className="p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{tour.title}</h1>
            <TilePriceBadge>
              <span className="text-base font-bold tabular-nums text-yellow-900">
                {price}
              </span>
              <span className="text-sm font-medium text-yellow-700">
                {ui.perPerson}
              </span>
            </TilePriceBadge>
          </div>
          <p className="mb-6 text-gray-700">{tour.summary}</p>
          <ul className="mb-6 list-disc space-y-1 pl-5 text-gray-700">
            {tour.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mb-8 text-sm text-gray-500">{ui.placesNote}</p>

          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            {ui.programLabel}
          </h2>
          <ol className="mb-8 list-decimal space-y-2 pl-5 text-gray-700">
            {tour.program.map((day) => (
              <li key={day}>{day}</li>
            ))}
          </ol>

          <div className="mb-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-900">
                {ui.includedLabel}
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-gray-700">
                {tour.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-900">
                {ui.excludedLabel}
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-gray-700">
                {tour.excluded.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mb-6 text-sm text-gray-500">{ui.priceNote}</p>

          <div className="flex max-w-md flex-col gap-2">
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {requestCopy.checkPrice}
            </button>
            <button
              type="button"
              onClick={() => setManagerOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-white hover:bg-[#1ebe57]"
            >
              <IconBrandWhatsapp className="h-4 w-4 shrink-0" stroke={2} />
              <IconBrandTelegram className="h-4 w-4 shrink-0" stroke={2} />
              {requestCopy.contactManager}
            </button>
          </div>
        </div>
      </article>

      {bookingOpen ? (
        <DeferredSimpleBookingPopup
          opened
          onClose={() => setBookingOpen(false)}
          item={{ name: tour.title, price: priceLabel }}
          mode="contact"
          variant="package"
          currentLocale={locale as Locale}
        />
      ) : null}
      {managerOpen ? (
        <ApartmentManagerContactPopup
          opened
          onClose={() => setManagerOpen(false)}
          propertyTitle={tour.title}
          locale={locale as Locale}
        />
      ) : null}
    </CatalogDetailShell>
  );
}

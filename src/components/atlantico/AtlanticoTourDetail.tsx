"use client";

import { CatalogBackLink } from "@/components/CatalogBackLink";
import { CatalogDetailShell } from "@/components/CatalogDetailShell";
import { ExcursionsIntermediaryNotice } from "@/components/ExcursionsIntermediaryNotice";
import { AtlanticoBookingSection } from "./AtlanticoBookingSection";
import { AtlanticoImage } from "./AtlanticoImage";
import { getAtlanticoUiCopy } from "./atlanticoCopy";
import { isAtlanticoIframeBooking } from "@/lib/atlantico/bookingMode";
import { atlanticoTourImageCandidates } from "@/lib/atlantico/images";
import { htmlToPlainText } from "@/lib/atlantico/parse";
import { parseFromPrice } from "@/lib/atlantico/prices";
import { formatTileAmount } from "@/components/TilePriceBadge";
import { useTranslation } from "@/hooks/useTranslation";
import translations from "@/i18n/tourDetail.json";
import { pickLocaleBundle, type Locale } from "@/types/locale";
import type {
  AtlanticoEventDetails,
  AtlanticoTourDetails,
} from "@/lib/atlantico/types";

type AtlanticoTourDetailProps = {
  tour: AtlanticoTourDetails;
  events: AtlanticoEventDetails[];
};

export function AtlanticoTourDetail({
  tour,
  events,
}: AtlanticoTourDetailProps) {
  const { locale, createLocaleLink } = useTranslation();
  const t = pickLocaleBundle(translations, locale);
  const copy = getAtlanticoUiCopy(locale);
  const tourCode = tour.code || tour.id;
  const imageSrc = atlanticoTourImageCandidates(tour.image, tourCode);
  const description = htmlToPlainText(tour.desc);
  const amount = parseFromPrice(tour.price);
  const hours = Number.parseInt(tour.duration || "", 10);
  const iframeMode = isAtlanticoIframeBooking();

  return (
    <CatalogDetailShell>
      <CatalogBackLink href={createLocaleLink("/tours")} label={t.backToTours} />

      <div className="mb-6">
        {t.intermediaryNotice ? (
          <ExcursionsIntermediaryNotice
            text={t.intermediaryNotice}
            as="h2"
            variant="card"
            className="mb-3"
          />
        ) : null}
        <h1 className="text-3xl font-bold text-gray-900">{tour.name}</h1>
        <p className="mt-2 text-sm text-blue-700">{copy.partnerPowered}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
        <div className="order-2 xl:order-1 xl:col-span-3">
          <div className="relative mb-8 aspect-video overflow-hidden rounded-lg bg-gray-100">
            <AtlanticoImage src={imageSrc} alt={tour.name} />
          </div>

          {description ? (
            <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {t.description}
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-gray-600">
                {description}
              </p>
            </div>
          ) : null}

          <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">{t.tourDetails}</h2>
            <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Number.isFinite(hours) && hours > 0 ? (
                <div className="flex justify-between border-b border-gray-100 py-2">
                  <dt className="text-gray-600">{copy.duration}</dt>
                  <dd className="font-medium text-gray-900">
                    {hours} {copy.hours}
                  </dd>
                </div>
              ) : null}
              {tour.childAge ? (
                <div className="flex justify-between border-b border-gray-100 py-2">
                  <dt className="text-gray-600">{copy.childAge}</dt>
                  <dd className="font-medium text-gray-900">{tour.childAge}</dd>
                </div>
              ) : null}
              {tour.infantAge ? (
                <div className="flex justify-between border-b border-gray-100 py-2">
                  <dt className="text-gray-600">{copy.infantAge}</dt>
                  <dd className="font-medium text-gray-900">{tour.infantAge}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>

        <aside
          className={
            iframeMode
              ? "order-1 xl:order-2 xl:col-span-4"
              : "order-1 xl:order-2 xl:col-span-1"
          }
        >
          <div
            className={
              iframeMode
                ? "rounded-lg border bg-white p-6 shadow-sm"
                : "rounded-lg border bg-white p-6 shadow-sm xl:sticky xl:top-6"
            }
          >
            {amount != null ? (
              <div className="mb-6 rounded-lg bg-blue-50 p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {copy.from} €{formatTileAmount(amount, locale as Locale)}
                </div>
                <div className="text-sm text-gray-600">{copy.perPerson}</div>
              </div>
            ) : null}
            <AtlanticoBookingSection
              tourCode={tourCode}
              tourName={tour.name}
              events={events}
              locale={locale}
            />
          </div>
        </aside>
      </div>
    </CatalogDetailShell>
  );
}

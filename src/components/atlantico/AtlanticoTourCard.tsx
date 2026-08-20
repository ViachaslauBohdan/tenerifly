"use client";

import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { AtlanticoImage } from "./AtlanticoImage";
import { getAtlanticoUiCopy } from "./atlanticoCopy";
import { atlanticoTourImageCandidates } from "@/lib/atlantico/images";
import { htmlToPlainText } from "@/lib/atlantico/parse";
import { parseFromPrice } from "@/lib/atlantico/prices";
import { formatTileAmount, TilePriceBadge } from "@/components/TilePriceBadge";
import { ViewDetailsLink } from "@/components/ViewDetailsLink";
import type { AtlanticoTourSummary } from "@/lib/atlantico/types";
import type { Locale } from "@/types/locale";

type AtlanticoTourCardProps = {
  tour: AtlanticoTourSummary;
  locale: Locale | string;
  href: string;
};

export function AtlanticoTourCard({
  tour,
  locale,
  href,
}: AtlanticoTourCardProps) {
  const router = useRouter();
  const copy = getAtlanticoUiCopy(locale);
  const imageSrc = atlanticoTourImageCandidates(tour.image, tour.code || tour.id);
  const description = htmlToPlainText(tour.desc);
  const amount = parseFromPrice(tour.price);
  const hours = Number.parseInt(tour.duration || "", 10);

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <AtlanticoImage
          src={imageSrc}
          alt={tour.name}
          onClick={() => router.push(href)}
        />
      </div>
      <div className="p-6">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{tour.name}</h3>
        {description ? (
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">{description}</p>
        ) : null}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          {Number.isFinite(hours) && hours > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden />
              {hours} {copy.hours}
            </span>
          ) : null}
          {amount != null ? (
            <TilePriceBadge>
              <span className="text-xs font-medium text-yellow-800">
                {copy.from}
              </span>
              <span className="font-semibold text-yellow-900">
                €{formatTileAmount(amount, locale as Locale)}
              </span>
            </TilePriceBadge>
          ) : null}
        </div>
        <div className="flex gap-3">
          <ViewDetailsLink href={href} className="w-full">
            {copy.viewDetails}
          </ViewDetailsLink>
        </div>
      </div>
    </article>
  );
}

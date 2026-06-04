"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { getAtlanticoCardCopy } from "@/lib/atlanticoCardCopy";
import { getAtlanticoExcursionsAffiliateUrl } from "@/lib/excursionAggregatorUrls";
import type { Locale } from "@/types/locale";

type AtlanticoExcursionCardProps = {
  locale: Locale | string;
  variant?: "home" | "tours";
};

export function AtlanticoExcursionCard({
  locale,
  variant = "home",
}: AtlanticoExcursionCardProps) {
  const copy = getAtlanticoCardCopy(locale);
  const affiliateUrl = getAtlanticoExcursionsAffiliateUrl(locale);

  const isTours = variant === "tours";
  const wrapperClass = isTours
    ? "mx-auto mb-10 w-full max-w-6xl"
    : "mx-auto max-w-3xl";
  const cardBorderClass = isTours
    ? "border-2 border-blue-200 ring-1 ring-blue-100"
    : "border border-blue-100";
  const leftPanelClass = isTours
    ? "flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-8 md:w-[38%] md:px-10 md:py-9"
    : "flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:w-2/5 md:p-10";
  const iconWrapClass = isTours
    ? "mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20 shadow-inner md:h-16 md:w-16"
    : "mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20";
  const titleClass = isTours
    ? "mb-1 text-xl font-bold text-white md:text-2xl"
    : "mb-2 text-2xl font-bold text-white";
  const rightPanelClass = isTours
    ? "flex flex-col justify-center px-8 py-8 md:w-[62%] md:px-10 md:py-9"
    : "flex flex-col justify-center p-8 md:w-3/5 md:p-10";
  const affiliateBtnClass = isTours
    ? "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl sm:w-fit sm:min-w-[220px]"
    : "inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-blue-700 hover:shadow-lg";

  return (
    <div className={wrapperClass}>
      <div
        className={`overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl ${cardBorderClass}`}
      >
        <div
          className={
            isTours
              ? "flex min-h-0 flex-col md:flex-row"
              : "flex min-h-[280px] items-stretch md:flex"
          }
        >
          <div className={leftPanelClass}>
            <div className="flex w-full max-w-xs flex-col items-center text-center">
              <div className={iconWrapClass}>
                <MapPin
                  className={
                    isTours
                      ? "h-7 w-7 text-white md:h-8 md:w-8"
                      : "h-8 w-8 text-white"
                  }
                  aria-hidden
                />
              </div>
              <h3 className={titleClass}>Atlántico Excursiones</h3>
              <p
                className={
                  isTours
                    ? "text-sm text-blue-100 md:text-base"
                    : "text-sm text-blue-100"
                }
              >
                {copy.tagline}
              </p>

              <div className="mt-6 w-full border-t border-white/25 pt-6">
                <p className="text-sm leading-snug text-blue-50">
                  {copy.whatsappHint}
                </p>
              </div>
            </div>
          </div>

          <div className={rightPanelClass}>
            <h4
              className={
                isTours
                  ? "mb-2 text-lg font-semibold text-gray-900 md:text-xl"
                  : "mb-3 text-xl font-semibold text-gray-900"
              }
            >
              {copy.partnerTitle}
            </h4>
            <p
              className={
                isTours
                  ? "mb-6 text-sm leading-relaxed text-gray-600 md:text-base"
                  : "mb-6 text-sm leading-relaxed text-gray-600 md:text-base"
              }
            >
              {copy.description}
            </p>
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={affiliateBtnClass}
            >
              {copy.toursCta}
              <ExternalLink
                className={isTours ? "h-4 w-4 shrink-0" : "h-4 w-4"}
                aria-hidden
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

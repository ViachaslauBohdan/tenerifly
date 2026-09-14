"use client";

import { ExternalLink } from "lucide-react";
import { getAtlanticoUiCopy } from "./atlanticoCopy";
import { getAtlanticoExcursionsAffiliateUrl } from "@/lib/excursionAggregatorUrls";
import type { Locale } from "@/types/locale";

type AtlanticoIframeBookingProps = {
  locale: Locale | string;
  className?: string;
};

export function AtlanticoIframeBooking({
  locale,
  className = "",
}: AtlanticoIframeBookingProps) {
  const copy = getAtlanticoUiCopy(locale);
  const src = getAtlanticoExcursionsAffiliateUrl(locale);

  return (
    <div className={`space-y-3 ${className}`.trim()}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{copy.iframeTitle}</h3>
          <p className="mt-1 text-sm text-gray-600">{copy.iframeHint}</p>
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          {copy.iframeOpenExternal}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <iframe
          title={copy.iframeTitle}
          src={src}
          className="h-[min(80vh,900px)] w-full bg-white"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="payment *; fullscreen *"
        />
      </div>
    </div>
  );
}

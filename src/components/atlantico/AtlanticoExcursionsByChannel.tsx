"use client";

import type { ReactNode } from "react";
import { AtlanticoIframeBooking } from "./AtlanticoIframeBooking";
import { getAtlanticoBookingChannel } from "@/lib/atlantico/bookingMode";
import type { Locale } from "@/types/locale";

type AtlanticoExcursionsByChannelProps = {
  locale: Locale | string;
  /** Catalog / home listing UI for REST mode only. */
  api: ReactNode;
  /** Optional iframe branch; defaults to AtlanticoIframeBooking. */
  iframe?: ReactNode;
  iframeClassName?: string;
};

/**
 * Single catalog switch: iframe white-label vs API tiles.
 * Booking form switch lives only in AtlanticoBookingSection.
 * Env source: NEXT_PUBLIC_ATLANTICO_BOOKING_MODE via getAtlanticoBookingChannel().
 */
export function AtlanticoExcursionsByChannel({
  locale,
  api,
  iframe,
  iframeClassName,
}: AtlanticoExcursionsByChannelProps) {
  if (getAtlanticoBookingChannel() === "iframe") {
    return (
      iframe ?? (
        <AtlanticoIframeBooking locale={locale} className={iframeClassName} />
      )
    );
  }

  return <>{api}</>;
}

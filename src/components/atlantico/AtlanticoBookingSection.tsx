"use client";

import { AtlanticoBookingPanel } from "./AtlanticoBookingPanel";
import { AtlanticoIframeBooking } from "./AtlanticoIframeBooking";
import { getAtlanticoBookingChannel } from "@/lib/atlantico/bookingMode";
import type { AtlanticoEventDetails } from "@/lib/atlantico/types";
import type { Locale } from "@/types/locale";

type AtlanticoBookingSectionProps = {
  tourCode: string;
  tourName: string;
  events: AtlanticoEventDetails[];
  locale: Locale | string;
};

export function AtlanticoBookingSection({
  tourCode,
  tourName,
  events,
  locale,
}: AtlanticoBookingSectionProps) {
  const channel = getAtlanticoBookingChannel();

  if (channel === "api") {
    return (
      <AtlanticoBookingPanel
        tourCode={tourCode}
        tourName={tourName}
        events={events}
        locale={locale}
      />
    );
  }

  return <AtlanticoIframeBooking locale={locale} />;
}

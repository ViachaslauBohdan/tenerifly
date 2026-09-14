export type AtlanticoBookingChannel = "api" | "iframe";

/**
 * Single env switch for Atlántico catalog + booking (no UI toggles).
 * `NEXT_PUBLIC_ATLANTICO_BOOKING_MODE=api|iframe` — default `iframe`.
 *
 * Catalog UI reads this only via AtlanticoExcursionsByChannel.
 * Booking UI reads this only via AtlanticoBookingSection.
 */
export function getAtlanticoBookingChannel(): AtlanticoBookingChannel {
  const value = (process.env.NEXT_PUBLIC_ATLANTICO_BOOKING_MODE || "iframe")
    .trim()
    .toLowerCase();
  return value === "api" ? "api" : "iframe";
}

export function isAtlanticoIframeBooking(): boolean {
  return getAtlanticoBookingChannel() === "iframe";
}

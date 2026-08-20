import { getAtlanticoEventDetails, getAtlanticoTourDetails } from "./client";
import { parseEventIds } from "./parse";
import type { AtlanticoEventDetails, AtlanticoTourDetails } from "./types";

export async function loadAtlanticoTourPage(
  code: string,
  locale: string
): Promise<{
  tour: AtlanticoTourDetails;
  events: AtlanticoEventDetails[];
} | null> {
  const tour = await getAtlanticoTourDetails(code, locale);
  if (!tour) return null;

  const eventIds = parseEventIds(tour.ids);
  const events = (
    await Promise.all(
      eventIds.map((id) => getAtlanticoEventDetails(id, locale).catch(() => null))
    )
  ).filter((event): event is AtlanticoEventDetails => Boolean(event));

  return { tour, events };
}

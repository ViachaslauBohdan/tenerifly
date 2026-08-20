import { listAtlanticoTours } from "./client";
import { isAtlanticoCatalogConfigured } from "./config";
import { atlanticoTourImageUrl } from "./images";
import { loadAtlanticoTourPage } from "./loadTour";
import { htmlToPlainText, isAtlanticoTourCode } from "./parse";
import { parseFromPrice } from "./prices";
import type { AtlanticoEventDetails, AtlanticoTourDetails } from "./types";

export async function tryLoadAtlanticoTour(
  id: string,
  locale: string
): Promise<{
  tour: AtlanticoTourDetails;
  events: AtlanticoEventDetails[];
} | null> {
  if (!isAtlanticoCatalogConfigured() || !isAtlanticoTourCode(id)) {
    return null;
  }
  try {
    return await loadAtlanticoTourPage(id, locale);
  } catch (error) {
    console.error("Atlantico tour load failed:", error);
    return null;
  }
}

export async function listAtlanticoTourCodes(): Promise<string[]> {
  if (!isAtlanticoCatalogConfigured()) return [];
  try {
    const tours = await listAtlanticoTours("en");
    return tours
      .map((tour) => tour.code || tour.id)
      .filter((code) => Boolean(code));
  } catch (error) {
    console.error("Atlantico tour list failed:", error);
    return [];
  }
}

export function atlanticoTourSeo(tour: AtlanticoTourDetails) {
  return {
    title: tour.name,
    description: htmlToPlainText(tour.desc) || tour.name,
    imageUrl:
      atlanticoTourImageUrl(tour.image, tour.code || tour.id) ||
      "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
    price: parseFromPrice(tour.price) ?? undefined,
  };
}


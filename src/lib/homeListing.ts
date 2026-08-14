import { localeContentKey, type Locale } from "@/types/locale";

/** Items fetched from Strapi for home previews (UI shows 3 per section). */
export const HOME_PREVIEW_LIMIT = 6;

/** Extra rows when filtering cars by locale client-side. */
export const HOME_CARS_FETCH_LIMIT = 24;

/** Full locale catalog to overlay onto the EN home preview (same IDs, not “latest 6”). */
export const HOME_LOCALE_OVERLAY_PAGE_SIZE = 1000;

export const HOME_DISPLAY_LIMIT = 3;

export function homeListQuery(limit = HOME_PREVIEW_LIMIT): string {
  return `pagination[pageSize]=${limit}&publicationState=live`;
}

/** Strapi on this project accepts full populate, not nested populate[images]. */
export function homePopulateQuery(): string {
  return "populate=*";
}

export type HomeCarRow = {
  locale?: string;
  title?: string;
  image?: string;
  images?: Array<{ url?: string } | null> | null;
};

export function getHomeCarImageUrl(
  car: HomeCarRow,
  apiBaseUrl: string
): string | null {
  const rawUrl =
    typeof car.image === "string" ? car.image : car.images?.[0]?.url;
  if (!rawUrl) return null;
  if (rawUrl.startsWith("http")) return rawUrl;
  return `${apiBaseUrl}${rawUrl}`;
}

export function carHasHomeImage(car: HomeCarRow): boolean {
  return getHomeCarImageUrl(car, "https://example.com") !== null;
}

function compareHomeCarTitle(a: HomeCarRow, b: HomeCarRow): number {
  return (a.title ?? "").localeCompare(b.title ?? "", undefined, {
    sensitivity: "base",
  });
}

/** Locale match, then only cars with images, sorted A→Z by title. */
export function pickHomeCarsByLocale<T extends HomeCarRow>(
  rows: T[],
  language: string
): T[] {
  const localeKey = localeContentKey(language as Locale);
  const withImages = rows.filter(carHasHomeImage).sort(compareHomeCarTitle);
  const forLocale = withImages.filter((car) => car.locale === localeKey);
  const pool =
    forLocale.length >= HOME_PREVIEW_LIMIT ? forLocale : withImages;
  return pool.slice(0, HOME_PREVIEW_LIMIT);
}

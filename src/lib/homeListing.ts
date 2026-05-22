/** Items fetched from Strapi for home previews (UI shows 3 per section). */
export const HOME_PREVIEW_LIMIT = 6;

/** Extra rows when filtering cars by locale client-side. */
export const HOME_CARS_FETCH_LIMIT = 24;

export const HOME_DISPLAY_LIMIT = 3;

export function homeListQuery(limit = HOME_PREVIEW_LIMIT): string {
  return `pagination[pageSize]=${limit}&publicationState=live`;
}

/** Strapi on this project accepts full populate, not nested populate[images]. */
export function homePopulateQuery(): string {
  return "populate=*";
}

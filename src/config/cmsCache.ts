/**
 * CMS content (cars, apartments, tours, blog) changes rarely — at most about once a week.
 * Prefer long-lived static/ISR caches; bust via POST /api/revalidate after publishing in Strapi.
 */

/**
 * Next.js page ISR (seconds). Must be a literal in `export const revalidate` on each page
 * (Next.js does not allow imported values there). Keep page files in sync with this number.
 */
export const CMS_PAGE_REVALIDATE = 604800;

/** `fetch()` cache for Strapi (server components / SSG data layer). */
export const CMS_FETCH_REVALIDATE = CMS_PAGE_REVALIDATE;

/** In-process Map cache TTL inside a single Node worker (e.g. during `next build`). */
export const CMS_MEMORY_CACHE_MS = CMS_FETCH_REVALIDATE * 1000;

export const CMS_CACHE_TAGS = {
  home: "home",
  properties: "properties",
  apartments: "apartments",
  cars: "cars",
  carsAll: "cars-all",
  tours: "tours",
  excursions: "excursions",
  blogs: "blogs",
  transfers: "transfers",
} as const;

export type CmsCacheTag = (typeof CMS_CACHE_TAGS)[keyof typeof CMS_CACHE_TAGS];

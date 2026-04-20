/** Slugs for the three “featured excursions” cards on the home page (order preserved). */
export const FEATURED_HOME_TOUR_SLUGS = [
  "mount-teide",
  "loro-parque",
  "dolphin-watching",
] as const;

export type FeaturedHomeTourLike = {
  slug?: string;
  isPopular?: boolean;
};

function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");
}

function slugIndex<T extends FeaturedHomeTourLike>(all: T[]): Map<string, T> {
  const bySlug = new Map<string, T>();
  for (const t of all) {
    if (t.slug == null || String(t.slug).length === 0) continue;
    const key = normalizeSlug(String(t.slug));
    if (!bySlug.has(key)) bySlug.set(key, t);
  }
  return bySlug;
}

/**
 * Picks tours for the home featured block.
 * If at least one of the three canonical slugs has `isPopular`, only those entries
 * (in order, and only when flagged) are returned. Otherwise returns the three slugs
 * by default so the page works before CMS flags exist.
 *
 * If nothing matches (e.g. CMS uses different slugs than the hardcoded list), falls back
 * to up to three `isPopular` tours, then to the first three tours.
 */
export function pickFeaturedHomeTours<T extends FeaturedHomeTourLike>(
  all: T[]
): T[] {
  if (!all?.length) return [];

  const bySlug = slugIndex(all);

  const byDefaultOrder = (): T[] =>
    FEATURED_HOME_TOUR_SLUGS.map((slug) => bySlug.get(slug)).filter(
      (x): x is T => x != null
    );

  const anyCanonicalFlagged = FEATURED_HOME_TOUR_SLUGS.some(
    (slug) => bySlug.get(slug)?.isPopular === true
  );

  let result: T[];

  if (!anyCanonicalFlagged) {
    result = byDefaultOrder();
  } else {
    result = FEATURED_HOME_TOUR_SLUGS.map((slug) => {
      const t = bySlug.get(slug);
      return t?.isPopular ? t : null;
    }).filter((x): x is T => x != null);
  }

  if (result.length > 0) return result;

  const popular = all.filter((t) => t.isPopular === true);
  if (popular.length > 0) return popular.slice(0, 3);

  return all.slice(0, 3);
}

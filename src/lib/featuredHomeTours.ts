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

/**
 * Picks tours for the home featured block.
 * If at least one of the three canonical slugs has `isPopular`, only those entries
 * (in order, and only when flagged) are returned. Otherwise returns the three slugs
 * by default so the page works before CMS flags exist.
 */
export function pickFeaturedHomeTours<T extends FeaturedHomeTourLike>(
  all: T[]
): T[] {
  const bySlug = new Map(
    all.filter((t) => t.slug).map((t) => [t.slug as string, t])
  );

  const byDefaultOrder = (): T[] =>
    FEATURED_HOME_TOUR_SLUGS.map((slug) => bySlug.get(slug)).filter(
      (x): x is T => x != null
    );

  const anyCanonicalFlagged = FEATURED_HOME_TOUR_SLUGS.some(
    (slug) => bySlug.get(slug)?.isPopular === true
  );

  if (!anyCanonicalFlagged) {
    return byDefaultOrder();
  }

  return FEATURED_HOME_TOUR_SLUGS.map((slug) => {
    const t = bySlug.get(slug);
    return t?.isPopular ? t : null;
  }).filter((x): x is T => x != null);
}

export const HERO_TABS = ["accommodation", "cars", "tours"] as const;

export type HeroTab = (typeof HERO_TABS)[number];

const TAB_ALIASES: Record<string, HeroTab> = {
  accommodation: "accommodation",
  stay: "accommodation",
  apartments: "accommodation",
  housing: "accommodation",
  cars: "cars",
  car: "cars",
  tours: "tours",
  tour: "tours",
  excursions: "tours",
  excursion: "tours",
};

export function parseHeroTab(value: string | null | undefined): HeroTab {
  if (!value) return "accommodation";
  const normalized = value.toLowerCase().trim();
  return TAB_ALIASES[normalized] ?? "accommodation";
}

export function isHeroTab(value: string): value is HeroTab {
  return (HERO_TABS as readonly string[]).includes(value);
}

const HERO_TAB_STORAGE_KEY = "tenerifejoy-hero-tab";

export function getStoredHeroTab(): HeroTab {
  if (typeof window === "undefined") {
    return "accommodation";
  }

  try {
    return parseHeroTab(localStorage.getItem(HERO_TAB_STORAGE_KEY));
  } catch {
    return "accommodation";
  }
}

export function setStoredHeroTab(tab: HeroTab): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(HERO_TAB_STORAGE_KEY, tab);
  } catch {
    // ignore quota / private mode
  }
}

/** URL `?tab=` wins when present; otherwise last tab from localStorage. */
export function resolveHeroTab(urlTab: string | null | undefined): HeroTab {
  if (urlTab) {
    return parseHeroTab(urlTab);
  }
  return getStoredHeroTab();
}

export const HERO_TAB_GROUPS: Record<
  string,
  { tenerife: string; worldwide: string }
> = {
  de: { tenerife: "Teneriffa", worldwide: "Weltweit" },
  en: { tenerife: "Tenerife", worldwide: "Worldwide" },
  es: { tenerife: "Tenerife", worldwide: "Mundial" },
  fr: { tenerife: "Ténérife", worldwide: "Monde entier" },
  pl: { tenerife: "Teneryfa", worldwide: "Świat" },
  ru: { tenerife: "Тенерифе", worldwide: "По всему миру" },
  uk: { tenerife: "Тенеріфе", worldwide: "Світ" },
  ua: { tenerife: "Тенеріфе", worldwide: "Світ" },
};

export const HERO_TABS = [
  "accommodation",
  "cars",
  "tours",
  "world-tours",
] as const;

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
  "world-tours": "world-tours",
  worldwide: "world-tours",
  global: "world-tours",
  world: "world-tours",
};

export function parseHeroTab(value: string | null | undefined): HeroTab {
  if (!value) return "accommodation";
  const normalized = value.toLowerCase().trim();
  return TAB_ALIASES[normalized] ?? "accommodation";
}

export function isHeroTab(value: string): value is HeroTab {
  return (HERO_TABS as readonly string[]).includes(value);
}

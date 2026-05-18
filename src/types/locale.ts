export type Locale = "en" | "pl" | "fr" | "ru" | "ua" | "de" | "es";

export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
}

export const LOCALES: LocaleConfig[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ua", name: "Українська", flag: "🇺🇦" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

/** Legacy URL segment → current locale (permanent redirect in middleware). */
export const LEGACY_LOCALE_PATHS: Record<string, Locale> = {
  uk: "ua",
};

/** i18n JSON bundles and Strapi often use `uk` as the Ukrainian content key. */
export function localeContentKey(locale: Locale | string): string {
  if (locale === "ua") return "uk";
  return locale;
}

/** Read a per-locale map (JSON bundle or inline copy) using URL locale `ua`. */
export function pickLocaleBundle<T>(
  bundle: Record<string, T>,
  locale: Locale | string
): T {
  const key = localeContentKey(locale);
  return bundle[key] ?? bundle.en;
}

export function localeDisplayCode(localeCode: string | undefined): string {
  if (!localeCode) return "";
  return localeCode.toUpperCase();
}

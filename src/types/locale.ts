export type Locale = "en" | "pl" | "fr" | "ru" | "uk" | "de" | "es";

export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
}

export const LOCALES: LocaleConfig[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

/** Two-letter label for the language switcher (Ukrainian ISO 639-1 is `uk`, which reads as UK next to 🇺🇦). */
export function localeDisplayCode(localeCode: string | undefined): string {
  if (localeCode === "uk") return "UA";
  if (!localeCode) return "";
  return localeCode.toUpperCase();
}

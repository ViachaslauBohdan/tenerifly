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

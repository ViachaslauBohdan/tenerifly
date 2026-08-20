import type { Locale } from "@/types/locale";
import {
  ATLANTICO_LANGUAGES,
  type AtlanticoLanguage,
} from "./types";

const LOCALE_TO_ATLANTICO: Record<Locale, AtlanticoLanguage> = {
  es: "CAS",
  en: "ENG",
  fr: "FRA",
  ru: "RUS",
  de: "ALE",
  pl: "ENG",
  ua: "ENG",
};

export function toAtlanticoLanguage(
  locale: Locale | string | null | undefined
): AtlanticoLanguage {
  const key = (locale || "en") as Locale;
  return LOCALE_TO_ATLANTICO[key] ?? "ENG";
}

export function isAtlanticoLanguage(
  value: string
): value is AtlanticoLanguage {
  return (ATLANTICO_LANGUAGES as readonly string[]).includes(value);
}

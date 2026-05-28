import type { Locale } from "@/types/locale";

import "dayjs/locale/de";
import "dayjs/locale/en";
import "dayjs/locale/es";
import "dayjs/locale/fr";
import "dayjs/locale/pl";
import "dayjs/locale/ru";
import "dayjs/locale/uk";

/** dayjs locale id (Ukrainian bundles use `uk`). */
export function dayjsLocale(locale: Locale | string): string {
  return locale === "ua" ? "uk" : locale;
}

/** Display format for Mantine date inputs per site language. */
export function getDateValueFormat(locale: Locale | string): string {
  switch (locale) {
    case "en":
      return "MM/DD/YYYY";
    case "de":
    case "pl":
    case "ru":
    case "ua":
      return "DD.MM.YYYY";
    case "fr":
    case "es":
      return "DD/MM/YYYY";
    default:
      return "DD/MM/YYYY";
  }
}

export function getTodayIsoDate(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().split("T")[0];
}

export function getIsoDatePlusDays(isoDate: string, daysToAdd: number): string {
  const date = new Date(`${isoDate}T12:00:00`);
  date.setDate(date.getDate() + daysToAdd);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isoStringToDate(iso: string): Date | null {
  if (!isIsoDate(iso)) return null;
  return new Date(`${iso}T12:00:00`);
}

export function dateToIsoString(date: Date | null): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

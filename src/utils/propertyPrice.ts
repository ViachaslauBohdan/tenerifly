import { localeContentKey } from "@/types/locale";

const PERIOD_LABELS: Record<string, Record<string, string>> = {
  day: {
    en: "day",
    ru: "день",
    pl: "dzień",
    fr: "jour",
    uk: "день",
    de: "Tag",
    es: "día",
  },
  week: {
    en: "week",
    ru: "неделя",
    pl: "tydzień",
    fr: "semaine",
    uk: "тиждень",
    de: "Woche",
    es: "semana",
  },
  month: {
    en: "month",
    ru: "месяц",
    pl: "miesiąc",
    fr: "mois",
    uk: "місяць",
    de: "Monat",
    es: "mes",
  },
  year: {
    en: "year",
    ru: "год",
    pl: "rok",
    fr: "an",
    uk: "рік",
    de: "Jahr",
    es: "año",
  },
  night: {
    en: "night",
    ru: "ночь",
    pl: "noc",
    fr: "nuit",
    uk: "ніч",
    de: "Nacht",
    es: "noche",
  },
  total: {
    en: "total",
    ru: "всего",
    pl: "całość",
    fr: "total",
    uk: "всього",
    de: "Gesamt",
    es: "total",
  },
};

function currencyPrefix(currency?: string): string {
  if (currency === "USD") return "$";
  if (currency === "GBP") return "£";
  if (currency === "RUB") return "₽";
  if (currency === "PLN") return "zł";
  return "€";
}

/** Localized label for Strapi `price.period` (day, week, month, year, total, …). */
export function getPropertyPeriodLabel(
  period: string | undefined | null,
  language: string
): string {
  const lang = localeContentKey(language);
  const key = (period || "total").toLowerCase();
  return PERIOD_LABELS[key]?.[lang] || PERIOD_LABELS[key]?.en || key;
}

/** e.g. `≈ €70/день` for apartment tiles (indicative rent price). */
export function formatPropertyPriceLabel(options: {
  amount: number;
  currency?: string;
  period?: string | null;
  language: string;
  approximate?: boolean;
}): string {
  const { amount, currency, period, language, approximate = true } = options;
  const prefix = currencyPrefix(currency);
  const label = getPropertyPeriodLabel(period, language);
  const amountPart = `${prefix}${amount}/${label}`;
  return approximate ? `≈ ${amountPart}` : amountPart;
}

/** e.g. `≈ EUR 70/день` for booking popup and detail views. */
export function formatPropertyPriceWithCurrency(options: {
  amount: number;
  currency: string;
  period?: string | null;
  language: string;
  approximate?: boolean;
}): string {
  const {
    amount,
    currency,
    period,
    language,
    approximate = true,
  } = options;
  const formatted = amount.toLocaleString();
  const label = getPropertyPeriodLabel(period, language);
  const amountPart = `${currency} ${formatted}/${label}`;
  return approximate ? `≈ ${amountPart}` : amountPart;
}

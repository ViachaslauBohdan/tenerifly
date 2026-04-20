import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/locale";

const NUMBER_LOCALE: Record<Locale, string> = {
  en: "en-GB",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  pl: "pl-PL",
  ru: "ru-RU",
  uk: "uk-UA",
};

export function formatTileAmount(n: number, locale: Locale): string {
  const raw = Number(n);
  if (Number.isNaN(raw)) return String(n);
  const hasFraction = Math.abs(raw % 1) > Number.EPSILON;
  return new Intl.NumberFormat(NUMBER_LOCALE[locale] ?? "en-GB", {
    maximumFractionDigits: hasFraction ? 2 : 0,
    minimumFractionDigits: hasFraction ? 2 : 0,
  }).format(raw);
}

/** Same yellow capsule as star ratings on home tiles */
export function TilePriceBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex max-w-full flex-wrap items-baseline gap-x-1.5 gap-y-0.5 rounded-full bg-yellow-100 px-3 py-1.5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TileCarPrice({
  currencySymbol,
  amount,
  perDaySuffix,
  locale,
}: {
  currencySymbol: string;
  amount: number;
  perDaySuffix: string;
  locale: Locale;
}) {
  const cur = currencySymbol.trim();
  const isLetterCode = /^[A-Za-z]{3}$/.test(cur);
  const formatted = formatTileAmount(amount, locale);

  return (
    <TilePriceBadge>
      <span
        className={cn(
          "shrink-0 font-semibold text-yellow-800",
          isLetterCode ? "text-xs uppercase tracking-wide" : "text-sm"
        )}
      >
        {cur}
      </span>
      <span className="text-base font-bold tabular-nums text-yellow-900">
        {formatted}
      </span>
      <span className="text-sm font-medium text-yellow-700">{perDaySuffix}</span>
    </TilePriceBadge>
  );
}

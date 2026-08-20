import type { ParsedPrices } from "./types";

function toNumber(value: string): number {
  const n = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function parsePerPerson(parts: string[]): ParsedPrices {
  return {
    kind: "perPerson",
    adult: toNumber(parts[0] ?? "0"),
    child: toNumber(parts[1] ?? "0"),
    infant: toNumber(parts[2] ?? "0"),
    adultCommission: toNumber(parts[3] ?? "0"),
    childCommission: toNumber(parts[4] ?? "0"),
    infantCommission: toNumber(parts[5] ?? "0"),
  };
}

function parsePerDay(parts: string[]): ParsedPrices {
  const tiers: Array<{ days: number; price: number; commission: number }> = [];
  for (let i = 0; i + 2 < parts.length; i += 3) {
    tiers.push({
      days: Math.round(toNumber(parts[i])),
      price: toNumber(parts[i + 1]),
      commission: toNumber(parts[i + 2]),
    });
  }
  return { kind: "perDay", tiers };
}

function parseUnique(parts: string[]): ParsedPrices {
  return {
    kind: "unique",
    price: toNumber(parts[0] ?? "0"),
    commission: toNumber(parts[1] ?? "0"),
  };
}

/**
 * Parse Atlántico `loadPrices` text.
 * `pProd`: 0 per person, 1 per product, 2 per day, 3 unique.
 */
export function parseAtlanticoPrices(
  raw: string,
  pProd?: string | number
): ParsedPrices | null {
  const parts = raw
    .trim()
    .split("|")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  if (parts.length === 0) return null;

  const type = String(pProd ?? "0");
  if (type === "2") return parsePerDay(parts);
  if (type === "1" || type === "3") return parseUnique(parts);
  if (parts.length >= 3) return parsePerPerson(parts);
  return parseUnique(parts);
}

export function estimateBookingTotal(
  prices: ParsedPrices | null,
  adults: number,
  childs: number,
  infants: number
): number | null {
  if (!prices) return null;
  if (prices.kind === "perPerson") {
    return (
      prices.adult * Math.max(0, adults) +
      prices.child * Math.max(0, childs) +
      prices.infant * Math.max(0, infants)
    );
  }
  if (prices.kind === "unique") {
    return prices.price;
  }
  const longest = prices.tiers.reduce(
    (best, tier) => (tier.days >= best.days ? tier : best),
    prices.tiers[0]
  );
  return longest?.price ?? null;
}

export function parseFromPrice(value: string | undefined | null): number | null {
  if (!value) return null;
  const n = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

import type {
  ParsedPrices,
  PerDayPrices,
  PerPersonPrices,
  UniquePrices,
} from "./types";

function toNumber(value: string): number {
  const n = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function parsePerPerson(parts: string[]): PerPersonPrices {
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

function parsePerDay(parts: string[]): PerDayPrices {
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

function parseUnique(parts: string[]): UniquePrices {
  return {
    kind: "unique",
    price: toNumber(parts[0] ?? "0"),
    commission: toNumber(parts[1] ?? "0"),
  };
}

/**
 * Atlántico often returns loadPrices as a JSON-encoded string body
 * (`"42.00|30.00|..."`) with Content-Type text/html. Empty / missing
 * prices may arrive as `[]`, `"[]"`, or `"|||||"`.
 * Production (`api.`) may return an object:
 * `{ PVPA, PVPC, PVPOS, COMA, COMC, COMOS }`.
 */
export function normalizeAtlanticoPriceRaw(data: unknown): string {
  if (data == null) return "";

  let value: unknown = data;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "[]") return "";
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
      trimmed.startsWith("{") ||
      trimmed.startsWith("[")
    ) {
      try {
        value = JSON.parse(trimmed);
      } catch {
        value = trimmed.replace(/^"+|"+$/g, "");
      }
    } else {
      value = trimmed;
    }
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    if (value.every((item) => typeof item === "string" || typeof item === "number")) {
      return value.map(String).join("|");
    }
    return "";
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const adult = record.PVPA ?? record.pvpa ?? record.adult;
    const child = record.PVPC ?? record.pvpc ?? record.child;
    const infant = record.PVPOS ?? record.pvpos ?? record.infant;
    if (adult != null || child != null || infant != null) {
      const adultCommission = record.COMA ?? record.coma ?? record.adultCommission ?? "0";
      const childCommission = record.COMC ?? record.comc ?? record.childCommission ?? "0";
      const infantCommission =
        record.COMOS ?? record.comis ?? record.comos ?? record.infantCommission ?? "0";
      return [
        adult ?? "0",
        child ?? "0",
        infant ?? "0",
        adultCommission,
        childCommission,
        infantCommission,
      ]
        .map((part) => String(part).trim())
        .join("|");
    }
    return "";
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value !== "string") return "";

  const raw = value.trim().replace(/^"+|"+$/g, "").trim();
  if (!raw || raw === "[]") return "";
  // All-empty pipe placeholders from bad date formats, e.g. "|||||"
  if (!/\d/.test(raw)) return "";
  return raw;
}

export function parseFromPrice(value: string | undefined | null): number | null {
  if (!value) return null;
  const n = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/**
 * Parse Atlántico `loadPrices` text.
 * `pProd`: 0 per person, 1 per product, 2 per day, 3 unique.
 */
export function parseAtlanticoPrices(
  raw: string,
  pProd?: string | number
): ParsedPrices | null {
  const normalized = normalizeAtlanticoPriceRaw(raw);
  const parts = normalized
    .split("|")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  if (parts.length === 0) return null;

  const type = String(pProd ?? "0");
  if (type === "2") {
    const parsed = parsePerDay(parts);
    return parsed.tiers.length > 0 ? parsed : null;
  }
  if (type === "1" || type === "3") {
    const parsed = parseUnique(parts);
    return Number.isFinite(parsed.price) ? parsed : null;
  }
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
    const guests = Math.max(0, adults) + Math.max(0, childs) + Math.max(0, infants);
    if (guests < 1) return null;
    return (
      prices.adult * Math.max(0, adults) +
      prices.child * Math.max(0, childs) +
      prices.infant * Math.max(0, infants)
    );
  }
  if (prices.kind === "unique") {
    return prices.price;
  }
  if (!prices.tiers.length) return null;
  const longest = prices.tiers.reduce(
    (best, tier) => (tier.days >= best.days ? tier : best),
    prices.tiers[0]
  );
  return longest?.price ?? null;
}

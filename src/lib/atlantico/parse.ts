import type { AtlanticoSessionItem } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseEventIds(ids: string | undefined | null): string[] {
  if (!ids) return [];
  return ids
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

/** Tours often list several classification ids, e.g. "1265045344,1445940121". */
export function countToursByCategory(
  tours: Array<{ category?: string | null }>
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const tour of tours) {
    for (const id of parseEventIds(tour.category)) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return counts;
}

export function classificationTourCount(
  classification: { id?: string; code?: string },
  counts: Map<string, number>
): number {
  if (classification.id && counts.has(classification.id)) {
    return counts.get(classification.id) ?? 0;
  }
  if (classification.code && counts.has(classification.code)) {
    return counts.get(classification.code) ?? 0;
  }
  return 0;
}

export function withPositiveTourCounts<T extends { count?: number }>(
  items: T[]
): T[] {
  return items.filter((item) => (item.count ?? 0) > 0);
}

export function isAtlanticoTourCode(id: string): boolean {
  return /^\d+$/.test(id.trim());
}

export function htmlToPlainText(html: string | undefined | null): string {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function yyyymmddToIso(value: string): string | null {
  const compact = value.replace(/-/g, "");
  if (!/^\d{8}$/.test(compact)) return null;
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
}

export function isoToYyyymmdd(iso: string): string {
  return iso.replace(/-/g, "");
}

export function firstDayOfMonthIso(isoDate: string): string {
  return `${isoDate.slice(0, 7)}-01`;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function sessionHasAvailability(
  session: AtlanticoSessionItem
): boolean {
  const available = Number.parseInt(session.available, 10);
  if (Number.isNaN(available)) return true;
  return available > 0;
}

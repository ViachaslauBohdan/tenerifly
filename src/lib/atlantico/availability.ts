import { sessionHasAvailability, yyyymmddToIso } from "./parse";
import type {
  AtlanticoLoadLimitsResponse,
  AtlanticoSessionItem,
} from "./types";

const DEFAULT_HORIZON_DAYS = 120;

export function canaryTodayIso(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Atlantic/Canary",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function addIsoDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  const yyyy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(utc.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Monday = 0 … Sunday = 6. Atlántico `wdays` uses this order; 0 means closed. */
export function mondayWeekdayIndex(isoDate: string): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  const jsDay = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return (jsDay + 6) % 7;
}

function datesFromWeekdays(
  wdays: number[] | undefined,
  fromIso: string,
  horizonDays: number
): string[] {
  if (!wdays?.some((value) => value > 0)) return [];
  const open = new Set<number>();
  wdays.forEach((value, index) => {
    if (value > 0 && index < 7) open.add(index);
  });
  const dates: string[] = [];
  for (let offset = 0; offset <= horizonDays; offset += 1) {
    const iso = addIsoDays(fromIso, offset);
    if (open.has(mondayWeekdayIndex(iso))) dates.push(iso);
  }
  return dates;
}

export function availableIsoDates(
  limits: AtlanticoLoadLimitsResponse | null | undefined,
  options?: { fromIso?: string; horizonDays?: number }
): string[] {
  if (!limits) return [];

  const fromSessions = Object.entries(limits.sessions ?? {})
    .filter(([, sessions]) =>
      (sessions ?? []).some((session) => sessionHasAvailability(session))
    )
    .map(([key]) => yyyymmddToIso(key))
    .filter((iso): iso is string => Boolean(iso));

  if (fromSessions.length > 0) {
    return [...new Set(fromSessions)].sort();
  }

  const dates = limits.dates?.date ?? [];
  const limitsArr = limits.dates?.limit ?? [];
  const used = limits.dates?.used ?? [];

  if (dates.length > 0) {
    return [
      ...new Set(
        dates
          .map((raw, index) => {
            const iso = yyyymmddToIso(raw);
            if (!iso) return null;
            const cap = limitsArr[index];
            const taken = used[index] ?? 0;
            if (typeof cap === "number" && cap > 0 && taken >= cap) return null;
            return iso;
          })
          .filter((iso): iso is string => Boolean(iso))
      ),
    ].sort();
  }

  return datesFromWeekdays(
    limits.dates?.wdays,
    options?.fromIso ?? canaryTodayIso(),
    options?.horizonDays ?? DEFAULT_HORIZON_DAYS
  );
}

/** Event `times` aligns with Monday-first `days` / `wdays`. "-" means no departure. */
export function weekdayTimeForIsoDate(
  times: string[] | undefined,
  isoDate: string
): string | null {
  const time = times?.[mondayWeekdayIndex(isoDate)]?.trim();
  if (!time || time === "-" || time === "00:00") return null;
  return time;
}

export function sessionsForIsoDate(
  limits: AtlanticoLoadLimitsResponse | null | undefined,
  isoDate: string
): AtlanticoSessionItem[] {
  if (!limits?.sessions) return [];
  const compact = isoDate.replace(/-/g, "");
  const sessions = limits.sessions[compact] ?? limits.sessions[isoDate] ?? [];
  return sessions.filter((session) => sessionHasAvailability(session));
}

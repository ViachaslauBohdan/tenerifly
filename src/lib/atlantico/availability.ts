import { sessionHasAvailability, yyyymmddToIso } from "./parse";
import type {
  AtlanticoLoadLimitsResponse,
  AtlanticoSessionItem,
} from "./types";

export function availableIsoDates(
  limits: AtlanticoLoadLimitsResponse | null | undefined
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

export function sessionsForIsoDate(
  limits: AtlanticoLoadLimitsResponse | null | undefined,
  isoDate: string
): AtlanticoSessionItem[] {
  if (!limits?.sessions) return [];
  const compact = isoDate.replace(/-/g, "");
  const sessions = limits.sessions[compact] ?? limits.sessions[isoDate] ?? [];
  return sessions.filter((session) => sessionHasAvailability(session));
}

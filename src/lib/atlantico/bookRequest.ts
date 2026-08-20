import { isAtlanticoLanguage } from "./language";
import { isValidEmail } from "./parse";
import type { AtlanticoConfirmRequest } from "./types";

export type BookRequestInput = {
  t_id?: unknown;
  t_group?: unknown;
  language?: unknown;
  tourDate?: unknown;
  sesTime?: unknown;
  adults?: unknown;
  childs?: unknown;
  infants?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  hotel?: unknown;
  room?: unknown;
  Notes?: unknown;
  notes?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown): number {
  const n = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export type BookRequestValidation =
  | { ok: true; value: Omit<AtlanticoConfirmRequest, "userId"> }
  | { ok: false; error: string };

export function validateBookRequest(
  input: BookRequestInput
): BookRequestValidation {
  const t_id = asTrimmedString(input.t_id);
  const t_group = asTrimmedString(input.t_group);
  const language = asTrimmedString(input.language).toUpperCase();
  const tourDate = asTrimmedString(input.tourDate);
  const sesTime = asTrimmedString(input.sesTime) || "00:00";
  const name = asTrimmedString(input.name);
  const email = asTrimmedString(input.email);
  const phone = asTrimmedString(input.phone);
  const adults = asCount(input.adults);
  const childs = asCount(input.childs);
  const infants = asCount(input.infants);

  if (!t_id) return { ok: false, error: "Event option is required" };
  if (!t_group) return { ok: false, error: "Tour is required" };
  if (!isAtlanticoLanguage(language)) {
    return { ok: false, error: "Unsupported language" };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tourDate)) {
    return { ok: false, error: "A valid tour date is required" };
  }
  if (!name) return { ok: false, error: "Name is required" };
  if (!isValidEmail(email)) return { ok: false, error: "Valid email is required" };
  if (phone.replace(/\D/g, "").length < 8) {
    return { ok: false, error: "Valid phone is required" };
  }
  if (adults + childs + infants < 1) {
    return { ok: false, error: "At least one guest is required" };
  }

  const notes = asTrimmedString(input.Notes) || asTrimmedString(input.notes);
  const hotel = asTrimmedString(input.hotel);
  const room = asTrimmedString(input.room);

  return {
    ok: true,
    value: {
      t_id,
      t_group,
      language,
      tourDate,
      sesTime,
      adults,
      childs,
      infants,
      name,
      email,
      phone,
      ...(hotel ? { hotel } : {}),
      ...(room ? { room } : {}),
      ...(notes ? { Notes: notes } : {}),
    },
  };
}

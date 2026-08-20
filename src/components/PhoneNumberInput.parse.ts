import {
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
  type E164Number,
} from "libphonenumber-js";

export function toE164(
  country: CountryCode,
  national: string
): E164Number | undefined {
  const digits = national.replace(/\D/g, "");
  if (!digits) return undefined;
  const dial = getCountryCallingCode(country).replace(/\D/g, "");
  const local =
    digits.startsWith(dial) && digits.length - dial.length >= 6
      ? digits.slice(dial.length)
      : digits;
  if (!local) return undefined;
  return `+${dial}${local}` as E164Number;
}

export function nationalFromE164(
  country: CountryCode,
  value: E164Number | undefined
): string {
  if (!value) return "";
  const dial = getCountryCallingCode(country).replace(/\D/g, "");
  const all = value.replace(/\D/g, "");
  if (all.startsWith(dial)) return all.slice(dial.length);
  return all;
}

export function parsePastedPhone(raw: string): {
  country: CountryCode;
  value: E164Number;
  national: string;
} | null {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("+")) return null;
  const parsed = parsePhoneNumberFromString(trimmed);
  if (!parsed?.country || !parsed.isValid()) return null;
  return {
    country: parsed.country,
    value: parsed.number as E164Number,
    national: parsed.nationalNumber,
  };
}

export function isPhoneNumberValid(
  country: CountryCode | undefined,
  value: E164Number | undefined
): boolean {
  return Boolean(country && value && isValidPhoneNumber(value, country));
}

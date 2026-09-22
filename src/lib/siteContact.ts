/** Public work phone shown in the footer and default WhatsApp button. */
export const SITE_PHONE_E164 = "+34604972372";
export const SITE_WHATSAPP_DIGITS = "34604972372";

/** Public manager Telegram used for apartment “write to manager” CTA. */
export const SITE_TELEGRAM_USERNAME = (
  process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "adamsvts"
).replace(/^@/, "");

/** Retired numbers still present on some CMS listings and old dumps. */
const RETIRED_WHATSAPP_DIGITS = new Set(["34613211069", "34656641433"]);

export function toWhatsAppDigits(raw?: string | null): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (!digits || RETIRED_WHATSAPP_DIGITS.has(digits)) {
    return SITE_WHATSAPP_DIGITS;
  }
  return digits;
}

export function whatsappHref(raw?: string | null): string {
  return `https://wa.me/${toWhatsAppDigits(raw)}`;
}

export function whatsappWithTextHref(
  text: string,
  rawPhone?: string | null
): string {
  return `https://wa.me/${toWhatsAppDigits(rawPhone)}?text=${encodeURIComponent(text)}`;
}

export function normalizeTelegramUsername(raw?: string | null): string {
  const cleaned = (raw ?? "").trim().replace(/^@/, "");
  return cleaned || SITE_TELEGRAM_USERNAME;
}

export function telegramWithTextHref(
  text: string,
  rawUsername?: string | null
): string {
  const user = normalizeTelegramUsername(rawUsername);
  return `https://t.me/${user}?text=${encodeURIComponent(text)}`;
}

export function displayPhone(raw?: string | null): string {
  const digits = toWhatsAppDigits(raw);
  return `+${digits}`;
}

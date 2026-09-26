export const COOKIE_CONSENT_STORAGE_KEY = "tenerifly-cookie-consent";
export const COOKIE_CONSENT_EVENT = "tenerifly-cookie-consent";

export type CookieConsentChoice = "accepted" | "rejected";

export function parseCookieConsent(
  value: string | null | undefined
): CookieConsentChoice | null {
  if (value === "accepted" || value === "rejected") return value;
  return null;
}

export function readCookieConsent(
  storage: { getItem(key: string): string | null } | null | undefined
): CookieConsentChoice | null {
  if (!storage) return null;
  try {
    return parseCookieConsent(storage.getItem(COOKIE_CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writeCookieConsent(
  storage: { setItem(key: string, value: string): void },
  choice: CookieConsentChoice
): void {
  storage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
}

export function publishCookieConsent(choice: CookieConsentChoice): void {
  writeCookieConsent(window.localStorage, choice);
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, { detail: choice })
  );
}

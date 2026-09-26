import { describe, expect, it } from "vitest";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  parseCookieConsent,
  readCookieConsent,
  writeCookieConsent,
} from "./cookieConsent";

describe("parseCookieConsent", () => {
  it("accepts only the two stored choices", () => {
    expect(parseCookieConsent("accepted")).toBe("accepted");
    expect(parseCookieConsent("rejected")).toBe("rejected");
  });

  it("ignores missing and unknown values", () => {
    expect(parseCookieConsent(null)).toBeNull();
    expect(parseCookieConsent(undefined)).toBeNull();
    expect(parseCookieConsent("")).toBeNull();
    expect(parseCookieConsent("Accepted")).toBeNull();
  });
});

describe("readCookieConsent", () => {
  it("returns null when storage is missing or throws", () => {
    expect(readCookieConsent(null)).toBeNull();
    expect(
      readCookieConsent({
        getItem() {
          throw new Error("blocked");
        },
      })
    ).toBeNull();
  });

  it("reads a stored choice", () => {
    const storage = {
      getItem(key: string) {
        return key === COOKIE_CONSENT_STORAGE_KEY ? "rejected" : null;
      },
    };
    expect(readCookieConsent(storage)).toBe("rejected");
  });
});

describe("writeCookieConsent", () => {
  it("stores the choice under the consent key", () => {
    const saved: Record<string, string> = {};
    writeCookieConsent(
      {
        setItem(key, value) {
          saved[key] = value;
        },
      },
      "accepted"
    );
    expect(saved[COOKIE_CONSENT_STORAGE_KEY]).toBe("accepted");
  });
});

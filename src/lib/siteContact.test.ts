import { describe, expect, it } from "vitest";
import {
  SITE_PHONE_E164,
  SITE_WHATSAPP_DIGITS,
  displayPhone,
  toWhatsAppDigits,
  whatsappHref,
} from "./siteContact";

describe("siteContact", () => {
  it("uses the work number as the public default", () => {
    expect(SITE_PHONE_E164).toBe("+34604972372");
    expect(SITE_WHATSAPP_DIGITS).toBe("34604972372");
    expect(toWhatsAppDigits()).toBe(SITE_WHATSAPP_DIGITS);
    expect(toWhatsAppDigits(null)).toBe(SITE_WHATSAPP_DIGITS);
    expect(toWhatsAppDigits("")).toBe(SITE_WHATSAPP_DIGITS);
    expect(whatsappHref()).toBe("https://wa.me/34604972372");
    expect(displayPhone()).toBe("+34604972372");
  });

  it("rewrites retired numbers to the work WhatsApp", () => {
    expect(toWhatsAppDigits("+34613211069")).toBe("34604972372");
    expect(toWhatsAppDigits("34613211069")).toBe("34604972372");
    expect(toWhatsAppDigits("+34 613 211 069")).toBe("34604972372");
    expect(displayPhone("+34613211069")).toBe("+34604972372");
    expect(whatsappHref("+34613211069")).toBe("https://wa.me/34604972372");

    expect(toWhatsAppDigits("+34656641433")).toBe("34604972372");
    expect(toWhatsAppDigits("34656641433")).toBe("34604972372");
    expect(displayPhone("+34656641433")).toBe("+34604972372");
    expect(whatsappHref("+34 656 641 433")).toBe("https://wa.me/34604972372");
  });

  it("keeps a different listing number unchanged", () => {
    expect(toWhatsAppDigits("+380959390292")).toBe("380959390292");
    expect(whatsappHref("+38 095 939 0292")).toBe("https://wa.me/380959390292");
    expect(displayPhone("+380959390292")).toBe("+380959390292");
  });
});

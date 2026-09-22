import { describe, expect, it } from "vitest";
import {
  SITE_PHONE_E164,
  SITE_TELEGRAM_USERNAME,
  SITE_WHATSAPP_DIGITS,
  displayPhone,
  telegramWithTextHref,
  toWhatsAppDigits,
  whatsappHref,
  whatsappWithTextHref,
} from "./siteContact";

describe("siteContact", () => {
  it("uses the work number as the public default", () => {
    expect(SITE_PHONE_E164).toBe("+34604972372");
    expect(SITE_WHATSAPP_DIGITS).toBe("34604972372");
    expect(SITE_TELEGRAM_USERNAME).toBe("adamsvts");
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

  it("builds WhatsApp and Telegram deep links with prefilled text", () => {
    const text =
      "Здравствуйте! Интересует «Sunny Duplex». Подскажите цену и свободные даты.";
    const wa = whatsappWithTextHref(text);
    const tg = telegramWithTextHref(text);
    expect(wa.startsWith("https://wa.me/34604972372?text=")).toBe(true);
    expect(decodeURIComponent(wa)).toContain("Sunny Duplex");
    expect(tg.startsWith("https://t.me/adamsvts?text=")).toBe(true);
    expect(decodeURIComponent(tg)).toContain("Sunny Duplex");
    expect(telegramWithTextHref(text, "@someone")).toContain("t.me/someone?");
  });
});

import { describe, expect, it } from "vitest";
import {
  APARTMENT_PRICE_RESPONSE_MINUTES,
  getApartmentBookingCopy,
  getApartmentManagerMessage,
} from "./apartmentBookingCopy";
import { formatPropertyPriceLabel } from "@/utils/propertyPrice";

describe("apartmentBookingCopy", () => {
  it("localizes the Russian check-price CTA and request title", () => {
    const copy = getApartmentBookingCopy("ru");
    expect(copy.checkPrice).toBe("Узнать точную цену");
    expect(copy.contactManager).toBe("Написать менеджеру");
    expect(copy.requestTitle).toBe("Запрос на бронирование");
    expect(copy.steps).toContain("Вы отправляете запрос");
    expect(copy.success).toContain(`${APARTMENT_PRICE_RESPONSE_MINUTES} минут`);
  });

  it("localizes Ukrainian CTAs via ua → uk content key", () => {
    const copy = getApartmentBookingCopy("ua");
    expect(copy.checkPrice).toBe("Дізнатися точну ціну");
    expect(copy.contactManager).toBe("Написати менеджеру");
  });

  it("provides a contact-manager label for every supported locale", () => {
    for (const locale of ["en", "ru", "ua", "pl", "fr", "de", "es"] as const) {
      const copy = getApartmentBookingCopy(locale);
      expect(copy.contactManager.trim().length).toBeGreaterThan(0);
      expect(copy.checkPrice.trim().length).toBeGreaterThan(0);
      expect(copy.chooseChannel.trim().length).toBeGreaterThan(0);
    }
  });

  it("builds a Russian manager prefill with the listing title", () => {
    expect(
      getApartmentManagerMessage(
        "Хостел номер Лос Кристианос рядом с пляжем",
        "ru"
      )
    ).toBe(
      "Здравствуйте! Интересует «Хостел номер Лос Кристианос рядом с пляжем». Подскажите цену и свободные даты."
    );
  });
});

describe("formatPropertyPriceLabel approximate rent", () => {
  it("prefixes apartment prices with ≈", () => {
    expect(
      formatPropertyPriceLabel({
        amount: 70,
        currency: "EUR",
        period: "day",
        language: "ru",
      })
    ).toBe("≈ €70/день");
  });
});

import { describe, expect, it } from "vitest";
import {
  APARTMENT_PRICE_RESPONSE_MINUTES,
  getApartmentBookingCopy,
} from "./apartmentBookingCopy";
import { formatPropertyPriceLabel } from "@/utils/propertyPrice";

describe("apartmentBookingCopy", () => {
  it("localizes the Russian check-price CTA and request title", () => {
    const copy = getApartmentBookingCopy("ru");
    expect(copy.checkPrice).toBe("Узнать точную цену");
    expect(copy.contactManager).toBe("Связаться с менеджером");
    expect(copy.requestTitle).toBe("Запрос на бронирование");
    expect(copy.steps).toContain("Вы отправляете запрос");
    expect(copy.success).toContain(`${APARTMENT_PRICE_RESPONSE_MINUTES} минут`);
  });

  it("localizes Ukrainian CTAs via ua → uk content key", () => {
    const copy = getApartmentBookingCopy("ua");
    expect(copy.checkPrice).toBe("Дізнатися точну ціну");
    expect(copy.contactManager).toBe("Зв'язатися з менеджером");
  });

  it("provides a contact-manager label for every supported locale", () => {
    for (const locale of ["en", "ru", "ua", "pl", "fr", "de", "es"] as const) {
      const copy = getApartmentBookingCopy(locale);
      expect(copy.contactManager.trim().length).toBeGreaterThan(0);
      expect(copy.checkPrice.trim().length).toBeGreaterThan(0);
    }
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

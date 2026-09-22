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
    expect(copy.requestTitle).toBe("Запрос на бронирование");
    expect(copy.steps).toContain("Вы отправляете запрос");
    expect(copy.success).toContain(`${APARTMENT_PRICE_RESPONSE_MINUTES} минут`);
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

import { describe, expect, it } from "vitest";
import { apartmentListingTypeLabel } from "./apartmentCardCopy";

const RENT_LABELS: Record<string, string> = {
  en: "For Rent",
  ru: "Аренда",
  pl: "Na wynajem",
  fr: "À louer",
  uk: "Оренда",
  de: "Zu vermieten",
  es: "En alquiler",
};

const SALE_LABELS: Record<string, string> = {
  en: "For Sale",
  ru: "Продажа",
  pl: "Na sprzedaż",
  fr: "À vendre",
  uk: "Продаж",
  de: "Zu verkaufen",
  es: "En venta",
};

describe("apartmentListingTypeLabel", () => {
  it("localizes rent and sale for Polish", () => {
    expect(apartmentListingTypeLabel("rent", "pl")).toBe("Na wynajem");
    expect(apartmentListingTypeLabel("sale", "pl")).toBe("Na sprzedaż");
  });

  it("maps ua to uk", () => {
    expect(apartmentListingTypeLabel("rent", "ua")).toBe("Оренда");
    expect(apartmentListingTypeLabel("sale", "ua")).toBe("Продаж");
  });

  it("falls back to English", () => {
    expect(apartmentListingTypeLabel("rent", "xx")).toBe("For Rent");
    expect(apartmentListingTypeLabel("sale", "xx")).toBe("For Sale");
    expect(apartmentListingTypeLabel(undefined, "pl")).toBe("Na wynajem");
  });

  it("covers every supported locale for rent and sale", () => {
    for (const [locale, label] of Object.entries(RENT_LABELS)) {
      expect(apartmentListingTypeLabel("rent", locale)).toBe(label);
    }
    for (const [locale, label] of Object.entries(SALE_LABELS)) {
      expect(apartmentListingTypeLabel("sale", locale)).toBe(label);
    }
  });
});

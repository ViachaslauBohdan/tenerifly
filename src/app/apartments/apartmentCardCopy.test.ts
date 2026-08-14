import { describe, expect, it } from "vitest";
import { apartmentListingTypeLabel } from "./apartmentCardCopy";

describe("apartmentListingTypeLabel", () => {
  it("localizes rent and sale for Polish", () => {
    expect(apartmentListingTypeLabel("rent", "pl")).toBe("Na wynajem");
    expect(apartmentListingTypeLabel("sale", "pl")).toBe("Na sprzedaż");
  });

  it("maps ua to uk", () => {
    expect(apartmentListingTypeLabel("rent", "ua")).toBe("Оренда");
  });

  it("falls back to English", () => {
    expect(apartmentListingTypeLabel("rent", "xx")).toBe("For Rent");
  });
});

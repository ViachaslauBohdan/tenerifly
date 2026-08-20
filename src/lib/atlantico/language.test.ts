import { describe, expect, it } from "vitest";
import { isAtlanticoLanguage, toAtlanticoLanguage } from "./language";

describe("toAtlanticoLanguage", () => {
  it("maps site locales to Atlantico language codes", () => {
    expect(toAtlanticoLanguage("es")).toBe("CAS");
    expect(toAtlanticoLanguage("en")).toBe("ENG");
    expect(toAtlanticoLanguage("fr")).toBe("FRA");
    expect(toAtlanticoLanguage("ru")).toBe("RUS");
    expect(toAtlanticoLanguage("de")).toBe("ALE");
    expect(toAtlanticoLanguage("pl")).toBe("ENG");
    expect(toAtlanticoLanguage("ua")).toBe("ENG");
  });

  it("falls back to English", () => {
    expect(toAtlanticoLanguage("xx")).toBe("ENG");
    expect(toAtlanticoLanguage(undefined)).toBe("ENG");
  });

  it("accepts known API language codes", () => {
    expect(isAtlanticoLanguage("CAS")).toBe(true);
    expect(isAtlanticoLanguage("ITA")).toBe(true);
    expect(isAtlanticoLanguage("PL")).toBe(false);
  });
});

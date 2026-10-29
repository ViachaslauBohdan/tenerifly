import { describe, expect, it } from "vitest";
import {
  catalogSearchQuery,
  matchesCatalogName,
  matchesCatalogSearch,
} from "./catalogSearch";

describe("matchesCatalogSearch", () => {
  it("matches a name or area and ignores empty queries", () => {
    const parts = ["Ocean view apartment", "Costa Adeje", "Terrace wifi"];
    expect(matchesCatalogSearch("", parts)).toBe(true);
    expect(matchesCatalogSearch("  costa adeje ", parts)).toBe(true);
    expect(matchesCatalogSearch("wifi", parts)).toBe(true);
    expect(matchesCatalogSearch("masca", parts)).toBe(false);
  });

  it("matches whole words, so park does not hit parking or sparkling", () => {
    expect(
      matchesCatalogSearch("park", [
        "Ocean view apartment in Park Royal I",
        "Private parking and a sparkling pool",
      ])
    ).toBe(true);
    expect(
      matchesCatalogSearch("park", [
        "House in Arico",
        "Private parking and a sparkling pool",
      ])
    ).toBe(false);
  });

  it("matches letters inside the apartment name only", () => {
    expect(matchesCatalogName("roy", "Ocean view apartment in Park Royal I")).toBe(
      true
    );
    expect(matchesCatalogName("park", "Private parking and a sparkling pool")).toBe(
      true
    );
    expect(
      matchesCatalogName("gigantes", "Rising Sun Apartment in Las Terrazas")
    ).toBe(false);
    expect(matchesCatalogName("", "Any title")).toBe(true);
  });

  it("reads the query as text even when the URL parsed it as a number", () => {
    expect(catalogSearchQuery(30)).toBe("30");
    expect(matchesCatalogSearch(catalogSearchQuery(30), ["30 m²"])).toBe(true);
  });
});

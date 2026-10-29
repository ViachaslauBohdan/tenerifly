import { describe, expect, it } from "vitest";
import { catalogSearchQuery, matchesCatalogSearch } from "./catalogSearch";

describe("matchesCatalogSearch", () => {
  it("matches a name or area and ignores empty queries", () => {
    const parts = ["Ocean view apartment", "Costa Adeje", "Terrace wifi"];
    expect(matchesCatalogSearch("", parts)).toBe(true);
    expect(matchesCatalogSearch("  costa adeje ", parts)).toBe(true);
    expect(matchesCatalogSearch("wifi", parts)).toBe(true);
    expect(matchesCatalogSearch("masca", parts)).toBe(false);
  });

  it("reads the query as text even when the URL parsed it as a number", () => {
    expect(catalogSearchQuery(30)).toBe("30");
    expect(matchesCatalogSearch(catalogSearchQuery(30), ["30 m²"])).toBe(true);
  });
});

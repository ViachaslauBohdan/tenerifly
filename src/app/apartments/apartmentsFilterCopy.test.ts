import { describe, expect, it } from "vitest";
import apartments from "@/i18n/apartments.json";

describe("apartment catalog filter copy", () => {
  it("localizes show more filters for Polish instead of English fallback", () => {
    expect(apartments.pl.showMoreFilters).toBe("Pokaż więcej filtrów");
    expect(apartments.pl.showLessFilters).toBe("Pokaż mniej filtrów");
    expect(apartments.uk.showMoreFilters).toMatch(/фільтр/i);
  });
});

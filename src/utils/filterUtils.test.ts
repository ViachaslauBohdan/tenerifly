import { describe, expect, it } from "vitest";
import {
  filtersToUrlParams,
  parseUrlParamsExcludingPagination,
} from "./filterUtils";

describe("catalog search URL params", () => {
  it("keeps the search text as a string and drops pagination", () => {
    const filters = parseUrlParamsExcludingPagination(
      new URLSearchParams("q=30&page=2&city=Adeje")
    );

    expect(filters.q).toBe("30");
    expect(filters.page).toBeUndefined();
    expect(filters.city).toBe("Adeje");
  });

  it("writes the query and skips filters that are off", () => {
    const params = filtersToUrlParams({
      q: "brand",
      city: "",
      parking: false,
      wifi: true,
    });

    expect(params.get("q")).toBe("brand");
    expect(params.get("wifi")).toBe("true");
    expect(params.has("parking")).toBe(false);
    expect(params.has("city")).toBe(false);
  });
});

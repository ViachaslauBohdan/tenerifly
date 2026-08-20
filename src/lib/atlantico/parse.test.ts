import { describe, expect, it } from "vitest";
import {
  classificationTourCount,
  countToursByCategory,
  htmlToPlainText,
  isAtlanticoTourCode,
  parseEventIds,
  withPositiveTourCounts,
  yyyymmddToIso,
} from "./parse";

describe("parseEventIds", () => {
  it("splits comma-separated event codes", () => {
    expect(parseEventIds(",184,546")).toEqual(["184", "546"]);
    expect(parseEventIds("184")).toEqual(["184"]);
    expect(parseEventIds("")).toEqual([]);
    expect(parseEventIds(null)).toEqual([]);
  });
});

describe("countToursByCategory", () => {
  it("counts a tour in each comma-separated classification", () => {
    const counts = countToursByCategory([
      { category: "1265045344,1445940121" },
      { category: "1265045414" },
      { category: "1445940121,1265045414" },
      { category: "" },
    ]);
    expect(counts.get("1265045344")).toBe(1);
    expect(counts.get("1445940121")).toBe(2);
    expect(counts.get("1265045414")).toBe(2);
    expect(
      classificationTourCount({ id: "1265045344", code: "22" }, counts)
    ).toBe(1);
    expect(
      classificationTourCount({ id: "missing", code: "26" }, counts)
    ).toBe(0);
    expect(
      classificationTourCount({ id: "1265045414", code: "26" }, counts)
    ).toBe(2);
  });

  it("drops classifications with no tours", () => {
    const counts = countToursByCategory([
      { category: "1717760499,1445940121" },
      { category: "1529399015" },
    ]);
    const listed = withPositiveTourCounts([
      { name: "Gastronomy", id: "1717760499", count: classificationTourCount({ id: "1717760499" }, counts) },
      { name: "Airport transfers", id: "1394099409", count: classificationTourCount({ id: "1394099409" }, counts) },
      { name: "Disabled Services", id: "1529399015", count: classificationTourCount({ id: "1529399015" }, counts) },
    ]);
    expect(listed.map((item) => item.name)).toEqual([
      "Gastronomy",
      "Disabled Services",
    ]);
    expect(listed.map((item) => item.count)).toEqual([1, 1]);
  });
});

describe("isAtlanticoTourCode", () => {
  it("accepts numeric supplier codes only", () => {
    expect(isAtlanticoTourCode("12")).toBe(true);
    expect(isAtlanticoTourCode("htiw625v803s6b69gzra8i0l")).toBe(false);
  });
});

describe("htmlToPlainText", () => {
  it("strips tags and decodes entities", () => {
    expect(htmlToPlainText("<p>Hello&nbsp;<b>Tenerife</b></p>")).toBe(
      "Hello Tenerife"
    );
  });
});

describe("yyyymmddToIso", () => {
  it("converts compact dates", () => {
    expect(yyyymmddToIso("20250808")).toBe("2025-08-08");
    expect(yyyymmddToIso("2025-08-08")).toBe("2025-08-08");
    expect(yyyymmddToIso("nope")).toBeNull();
  });
});

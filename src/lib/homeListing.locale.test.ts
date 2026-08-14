import { describe, expect, it } from "vitest";
import {
  HOME_LOCALE_OVERLAY_PAGE_SIZE,
  HOME_PREVIEW_LIMIT,
  pickHomeCarsByLocale,
} from "./homeListing";

describe("home listing locale overlay size", () => {
  it("overlays the full catalog, not the latest preview page", () => {
    expect(HOME_LOCALE_OVERLAY_PAGE_SIZE).toBe(1000);
    expect(HOME_LOCALE_OVERLAY_PAGE_SIZE).toBeGreaterThan(HOME_PREVIEW_LIMIT);
  });
});


describe("pickHomeCarsByLocale", () => {
  const rows = [
    { title: "A EN", locale: "en", images: [{ url: "/a.jpg" }] },
    { title: "B UK", locale: "uk", images: [{ url: "/b.jpg" }] },
    { title: "C UK", locale: "uk", images: [{ url: "/c.jpg" }] },
    { title: "D UK", locale: "uk", images: [{ url: "/d.jpg" }] },
    { title: "E UK", locale: "uk", images: [{ url: "/e.jpg" }] },
    { title: "F UK", locale: "uk", images: [{ url: "/f.jpg" }] },
    { title: "G UK", locale: "uk", images: [{ url: "/g.jpg" }] },
  ];

  it("maps URL locale ua to CMS locale uk", () => {
    const picked = pickHomeCarsByLocale(rows, "ua");
    expect(picked.every((car) => car.locale === "uk")).toBe(true);
    expect(picked.length).toBeGreaterThan(0);
  });

  it("falls back to imaged cars when locale bucket is thin", () => {
    const thin = [
      { title: "Only EN", locale: "en", images: [{ url: "/a.jpg" }] },
    ];
    const picked = pickHomeCarsByLocale(thin, "ua");
    expect(picked).toHaveLength(1);
    expect(picked[0].title).toBe("Only EN");
  });
});

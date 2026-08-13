import { describe, expect, it } from "vitest";
import {
  hybridLocalizedRow,
  mergeLocalizedCatalog,
  needsCmsEnTextFallback,
  resolveCmsDocument,
} from "./cmsLocalizedContent";

describe("needsCmsEnTextFallback", () => {
  it("needs fallback when document is missing", () => {
    expect(needsCmsEnTextFallback(null)).toBe(true);
    expect(needsCmsEnTextFallback(undefined)).toBe(true);
  });

  it("needs fallback when description or title is blank", () => {
    expect(
      needsCmsEnTextFallback({ title: "T", description: "   " })
    ).toBe(true);
    expect(
      needsCmsEnTextFallback({ title: "", description: "Body" })
    ).toBe(true);
  });

  it("does not need fallback when title and description exist", () => {
    expect(
      needsCmsEnTextFallback({ title: "T", description: "Body" })
    ).toBe(false);
  });
});

describe("resolveCmsDocument", () => {
  const en = {
    documentId: "doc1",
    title: "EN title",
    description: "EN description",
    locale: "en",
    images: ["en.jpg"],
  };
  const uk = {
    documentId: "doc1",
    title: "UA title",
    description: "Український опис",
    locale: "uk",
  };

  it("returns EN document for en locale", () => {
    expect(resolveCmsDocument(en, null, "en")).toEqual(en);
  });

  it("maps ua to uk and returns localized text", () => {
    expect(resolveCmsDocument(uk, en, "ua")).toMatchObject({
      title: "UA title",
      description: "Український опис",
      locale: "uk",
    });
  });

  it("falls back to EN when localized locale 404s", () => {
    expect(resolveCmsDocument(null, en, "ua")).toEqual(en);
  });

  it("fills empty localized description from EN", () => {
    const partial = {
      documentId: "doc1",
      title: "UA title",
      description: "",
      locale: "uk",
    };
    expect(resolveCmsDocument(partial, en, "ua")).toMatchObject({
      title: "UA title",
      description: "EN description",
      locale: "uk",
    });
  });
});

describe("hybridLocalizedRow", () => {
  it("keeps EN description when localization description is empty", () => {
    const base = {
      documentId: "car1",
      title: "BMW",
      description: "English body",
      locale: "en",
      price: 100,
    };
    const hybrid = hybridLocalizedRow(base, {
      title: "BMW",
      description: "",
      locale: "uk",
      documentId: "car1-uk",
    });
    expect(hybrid.description).toBe("English body");
    expect(hybrid.locale).toBe("uk");
    expect(hybrid.price).toBe(100);
    expect(hybrid.documentId).toBe("car1-uk");
  });
});

describe("mergeLocalizedCatalog", () => {
  const enRows = [
    {
      documentId: "a",
      title: "Apt A EN",
      description: "Desc A EN",
      locale: "en",
    },
    {
      documentId: "b",
      title: "Apt B EN",
      description: "Desc B EN",
      locale: "en",
    },
  ];

  it("returns EN catalog when localized list is empty (uk/pl case)", () => {
    expect(mergeLocalizedCatalog(enRows, [])).toEqual(enRows);
  });

  it("keeps full EN size when only a stub locale exists (ru case)", () => {
    const ruStub = [
      {
        documentId: "a",
        title: "Квартира A",
        description: "Описание A",
        locale: "ru",
      },
    ];
    const merged = mergeLocalizedCatalog(enRows, ruStub);
    expect(merged).toHaveLength(2);
    expect(merged[0]).toMatchObject({
      documentId: "a",
      title: "Квартира A",
      description: "Описание A",
      locale: "ru",
    });
    expect(merged[1]).toMatchObject({
      documentId: "b",
      title: "Apt B EN",
      description: "Desc B EN",
    });
  });

  it("appends localized-only extras not present in EN", () => {
    const localized = [
      {
        documentId: "extra",
        title: "Only RU",
        description: "Только RU",
        locale: "ru",
      },
    ];
    const merged = mergeLocalizedCatalog(enRows, localized);
    expect(merged).toHaveLength(3);
    expect(merged[2].documentId).toBe("extra");
  });
});

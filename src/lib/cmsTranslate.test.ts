import { describe, expect, it } from "vitest";
import {
  splitForTranslation,
  translationLooksValid,
} from "../../scripts/lib/cmsTranslate.mjs";
import { buildLocalePayload, hasRequiredLocaleFields } from "../../scripts/lib/propertyLocales.mjs";

describe("splitForTranslation", () => {
  it("keeps short text as one chunk", () => {
    expect(splitForTranslation("Hello", 20)).toEqual(["Hello"]);
  });

  it("splits long text on paragraph boundaries", () => {
    const text = `${"a".repeat(12)}\n\n${"b".repeat(12)}`;
    expect(splitForTranslation(text, 20)).toHaveLength(2);
    expect(splitForTranslation(text, 20)[0]).toContain("a");
    expect(splitForTranslation(text, 20)[1]).toContain("b");
  });
});

describe("translationLooksValid", () => {
  it("rejects empty, warnings, and prefixed fallbacks", () => {
    expect(translationLooksValid("Hello", "", "uk")).toBe(false);
    expect(
      translationLooksValid("Hello", "MYMEMORY WARNING: quota", "uk")
    ).toBe(false);
    expect(translationLooksValid("Hello", "[UK] Hello", "uk")).toBe(false);
  });

  it("rejects unchanged long source text", () => {
    const source = "A".repeat(90);
    expect(translationLooksValid(source, source, "uk")).toBe(false);
  });

  it("accepts a real translation", () => {
    expect(translationLooksValid("Hello", "Привіт", "uk")).toBe(true);
  });
});

describe("buildLocalePayload", () => {
  it("copies required EN fields and replaces title/description", () => {
    const payload = buildLocalePayload(
      {
        id: 1,
        documentId: "abc",
        locale: "en",
        slug: "ocean-view",
        title: "EN title",
        description: "EN body",
        type: "rent",
        price: { id: 9, amount: 100, currency: "EUR" },
        images: [{ id: 4, url: "/x.jpg", mime: "image/jpeg" }],
      },
      { title: "UA title", description: "UA body" }
    );
    expect(payload.title).toBe("UA title");
    expect(payload.description).toBe("UA body");
    expect(payload.type).toBe("rent");
    expect(payload.price).toEqual({ amount: 100, currency: "EUR" });
    expect(payload.images).toEqual([4]);
    expect(payload.slug).toBeUndefined();
    expect(payload.documentId).toBeUndefined();
  });
});

describe("hasRequiredLocaleFields", () => {
  it("rejects records missing category or components", () => {
    expect(
      hasRequiredLocaleFields({
        title: "T",
        category: null,
        price: { amount: 1 },
      })
    ).toBe(false);
  });

  it("accepts a complete EN record", () => {
    expect(
      hasRequiredLocaleFields({
        category: "apartment",
        price: { amount: 1 },
        specifications: { bedrooms: 1 },
        location: { city: "Adeje" },
        contact: { name: "A" },
      })
    ).toBe(true);
  });
});

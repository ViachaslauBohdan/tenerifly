import { describe, expect, it } from "vitest";
import {
  cmsLocale,
  localeContentKey,
  mergeCmsLocalizedText,
} from "./locale";

describe("cmsLocale / localeContentKey", () => {
  it("maps ua to uk for Strapi", () => {
    expect(localeContentKey("ua")).toBe("uk");
    expect(cmsLocale("ua")).toBe("uk");
    expect(cmsLocale(undefined)).toBe("en");
    expect(cmsLocale("ru")).toBe("ru");
  });

  it("keeps every supported CMS locale key stable", () => {
    for (const code of ["en", "ru", "pl", "de", "es", "fr"] as const) {
      expect(cmsLocale(code)).toBe(code);
    }
  });
});

describe("mergeCmsLocalizedText", () => {
  it("keeps localized text when present", () => {
    const merged = mergeCmsLocalizedText(
      {
        title: "UA title",
        description: "UA description",
        locale: "uk",
      },
      {
        title: "EN title",
        description: "EN description",
        locale: "en",
      }
    );
    expect(merged.title).toBe("UA title");
    expect(merged.description).toBe("UA description");
    expect(merged.locale).toBe("uk");
  });

  it("falls back to EN when localized description is empty", () => {
    const merged = mergeCmsLocalizedText(
      {
        title: "UA title",
        description: "   ",
        locale: "uk",
      },
      {
        title: "EN title",
        description: "EN description",
        locale: "en",
      }
    );
    expect(merged.title).toBe("UA title");
    expect(merged.description).toBe("EN description");
  });

  it("returns fallback when localized is null", () => {
    const en = {
      title: "EN title",
      description: "EN description",
      locale: "en",
    };
    expect(mergeCmsLocalizedText(null, en)).toEqual(en);
  });
});

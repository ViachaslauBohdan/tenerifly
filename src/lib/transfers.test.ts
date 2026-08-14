import { describe, expect, it } from "vitest";
import { getTransferLocaleText } from "./transfers";

describe("getTransferLocaleText", () => {
  it.each([
    ["en", "Airport Transfers"],
    ["pl", "Transfery z lotniska"],
    ["ru", "Трансферы из аэропорта"],
    ["ua", "Трансфери з аеропорту"],
    ["uk", "Трансфери з аеропорту"],
    ["de", "Flughafentransfers"],
    ["es", "Traslados al aeropuerto"],
    ["fr", "Transferts aéroport"],
  ] as const)("returns %s section title", (locale, title) => {
    expect(getTransferLocaleText(locale).sectionTitle).toBe(title);
  });

  it("maps ua to uk instead of falling back to English", () => {
    expect(getTransferLocaleText("ua").sectionTitle).not.toBe(
      "Airport Transfers"
    );
    expect(getTransferLocaleText("ua").sectionSubtitle).toMatch(/Тенерифе/);
  });

  it("falls back to English for unknown locales", () => {
    expect(getTransferLocaleText("xx").sectionTitle).toBe("Airport Transfers");
  });
});

import { describe, expect, it } from "vitest";
import {
  getTransferFallbackImage,
  getTransferImage,
  getTransferLocaleText,
  localizeTransfer,
  resolveTransferMediaUrl,
  type Transfer,
} from "./transfers";

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

const englishEightSeater: Transfer = {
  id: 1,
  documentId: "bgvjodtb42cajmle0qudkygp",
  title: "Mercedes Sprinter 8 seats airport transfer",
  description:
    "Private airport transfer in Tenerife for groups up to 8 passengers. Ideal for families and small groups travelling with luggage.",
  seats: 8,
  price_south_airport: 70,
  price_north_airport: 120,
  currency: "EUR",
};

describe("localizeTransfer", () => {
  it("replaces English CMS title and description for ua", () => {
    const localized = localizeTransfer(englishEightSeater, "ua");
    expect(localized.title).toBe(
      "Mercedes Sprinter 8 місць — трансфер з аеропорту"
    );
    expect(localized.description).toMatch(/до 8 пасажирів/);
    expect(localized.title).not.toBe(englishEightSeater.title);
  });

  it("replaces English CMS copy for pl", () => {
    const localized = localizeTransfer(englishEightSeater, "pl");
    expect(localized.title).toBe(
      "Mercedes Sprinter 8 miejsc — transfer z lotniska"
    );
  });

  it("keeps English for en", () => {
    expect(localizeTransfer(englishEightSeater, "en").title).toBe(
      englishEightSeater.title
    );
  });

  it("does not override an already localized CMS title", () => {
    const cmsUk = {
      ...englishEightSeater,
      title: "CMS українська назва",
      description: "CMS український опис",
    };
    expect(localizeTransfer(cmsUk, "ua").title).toBe("CMS українська назва");
  });
});

describe("getTransferImage", () => {
  it("keeps Cloudinary URLs", () => {
    expect(
      resolveTransferMediaUrl(
        "https://res.cloudinary.com/dlnvckilf/image/upload/v1/van.jpg"
      )
    ).toBe("https://res.cloudinary.com/dlnvckilf/image/upload/v1/van.jpg");
  });

  it("prefixes Strapi /uploads paths instead of serving them from the website", () => {
    expect(resolveTransferMediaUrl("/uploads/sprinter.jpg")).toBe(
      "https://tenerifly-strapi-production.up.railway.app/uploads/sprinter.jpg"
    );
  });

  it("uses the CMS image when present", () => {
    expect(
      getTransferImage({
        ...englishEightSeater,
        images: [
          {
            url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1/8.jpg",
          },
        ],
      })
    ).toBe("https://res.cloudinary.com/dlnvckilf/image/upload/v1/8.jpg");
  });

  it("falls back to the local Sprinter photo when CMS media is missing", () => {
    expect(getTransferImage(englishEightSeater)).toBe(
      "/transfers/mercedes-sprinter-8.jpg"
    );
    expect(
      getTransferFallbackImage({
        ...englishEightSeater,
        seats: 13,
        title: "Mercedes Sprinter 13 seats airport transfer",
      })
    ).toBe("/transfers/mercedes-sprinter-13.jpg");
  });
});

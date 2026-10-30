import { describe, expect, it } from "vitest";
import { parsePropertyImport, readPropertyJsonDocuments } from "./propertyImport";

const villa = {
  title: "5 bedrooms Villa Playa El Duque with heated pool",
  slug: "5-bedrooms-villa-playa-el-duque-with-heated-pool",
  description: "A modern villa in El Duque.",
  type: "rent",
  property_status: "available",
  featured: false,
  category: "villa",
  price: { amount: 730, currency: "EUR", period: "day" },
  specifications: { total_area: 320, bedrooms: 5, bathrooms: 4, living_area: null },
  features: { has_pool: true, has_garage: true },
  location: {
    address: "Calle Bischofshofen",
    city: "Costa Adeje",
    region: "Tenerife",
    postal_code: "38679",
    latitude: null,
  },
  contact: {
    name: "Adam Savytskyi",
    phone: "+34613211069",
    preferred_contact: "telegram",
  },
  _import: { media_folder: "villa" },
  id: 99,
  documentId: "keep-away",
};

describe("parsePropertyImport", () => {
  it("accepts a bulk array and drops fields that could change old records", () => {
    const preview = parsePropertyImport(JSON.stringify([villa]));

    expect(preview.ok).toBe(true);
    expect(preview.properties).toHaveLength(1);
    expect(preview.properties[0]).toMatchObject({
      title: villa.title,
      slug: villa.slug,
      type: "rent",
      category: "villa",
      price: { amount: 730, currency: "EUR", period: "day" },
      location: { city: "Costa Adeje" },
    });
    expect(preview.properties[0]).not.toHaveProperty("id");
    expect(preview.properties[0]).not.toHaveProperty("documentId");
    expect(preview.properties[0]).not.toHaveProperty("_import");
    expect(preview.properties[0].specifications).toEqual({
      total_area: 320,
      bedrooms: 5,
      bathrooms: 4,
    });
  });

  it("accepts one object", () => {
    const preview = parsePropertyImport(JSON.stringify(villa));
    expect(preview.ok).toBe(true);
    expect(preview.properties).toHaveLength(1);
  });

  it("highlights broken JSON and does not produce properties", () => {
    const preview = parsePropertyImport("{ title: ");
    expect(preview.ok).toBe(false);
    expect(preview.properties).toEqual([]);
    expect(preview.issues[0]?.index).toBe(-1);
    expect(preview.issues[0]?.message).toMatch(/JSON не читается/);
  });

  it("highlights a wrong price and a missing city without accepting the batch", () => {
    const preview = parsePropertyImport(
      JSON.stringify([
        villa,
        {
          ...villa,
          slug: "second",
          title: "Second",
          price: "850 EUR / night",
          location: { address: "Beach" },
        },
      ])
    );

    expect(preview.ok).toBe(false);
    expect(preview.properties).toEqual([]);
    expect(preview.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ index: 1, path: "price" }),
        expect.objectContaining({ index: 1, path: "location.city" }),
      ])
    );
  });

  it("merges json files and reports a file that is not valid json", () => {
    const merged = readPropertyJsonDocuments([
      { name: "villa.json", text: JSON.stringify(villa) },
      { name: "batch.json", text: JSON.stringify([{ ...villa, slug: "second", title: "Second" }]) },
      { name: "broken.json", text: "{ title:" },
    ]);

    expect(merged.fileIssues).toEqual([
      expect.objectContaining({ name: "broken.json" }),
    ]);
    const preview = parsePropertyImport(merged.json);
    expect(preview.ok).toBe(true);
    expect(preview.properties.map((item) => item.slug)).toEqual([
      villa.slug,
      "second",
    ]);
  });

  it("highlights a repeated slug inside the same paste", () => {
    const preview = parsePropertyImport(JSON.stringify([villa, { ...villa }]));
    expect(preview.ok).toBe(false);
    expect(preview.issues).toEqual([
      expect.objectContaining({ index: 1, path: "slug" }),
    ]);
  });
});

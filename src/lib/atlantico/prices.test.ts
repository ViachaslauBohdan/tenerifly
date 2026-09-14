import { describe, expect, it } from "vitest";
import {
  estimateBookingTotal,
  normalizeAtlanticoPriceRaw,
  parseAtlanticoPrices,
} from "./prices";

/** Live body from api.atlanticoexcursiones.com/loadPrices/{code}/{date} */
const PROD_PVPA_BODY = {
  PVPA: "44.00",
  PVPC: "32.00",
  PVPOS: "0.00",
  COMA: "6.60",
  COMC: "4.80",
  COMOS: "0.00",
};

/** Live body from testapi loadPrices (JSON-encoded pipe string). */
const TESTAPI_QUOTED_PIPES = '"42.00|30.00|0.00|6.30|4.50|0.00"';

describe("normalizeAtlanticoPriceRaw", () => {
  it("unwraps JSON-encoded price strings from testapi", () => {
    expect(normalizeAtlanticoPriceRaw(TESTAPI_QUOTED_PIPES)).toBe(
      "42.00|30.00|0.00|6.30|4.50|0.00"
    );
  });

  it("rejects empty array placeholders that previously became Total €0", () => {
    expect(normalizeAtlanticoPriceRaw("[]")).toBe("");
    expect(normalizeAtlanticoPriceRaw([])).toBe("");
    expect(normalizeAtlanticoPriceRaw('"[]"')).toBe("");
    expect(normalizeAtlanticoPriceRaw('"|||||"')).toBe("");
    expect(normalizeAtlanticoPriceRaw("|||||")).toBe("");
  });

  it("maps production API PVPA/PVPC objects to pipe strings", () => {
    expect(normalizeAtlanticoPriceRaw(PROD_PVPA_BODY)).toBe(
      "44.00|32.00|0.00|6.60|4.80|0.00"
    );
  });

  it("maps lowercase pvpa aliases", () => {
    expect(
      normalizeAtlanticoPriceRaw({
        pvpa: "10",
        pvpc: "5",
        pvpos: "0",
        coma: "1",
        comc: "0.5",
        comos: "0",
      })
    ).toBe("10|5|0|1|0.5|0");
  });

  it("returns empty for unrelated objects", () => {
    expect(normalizeAtlanticoPriceRaw({ message: "no prices" })).toBe("");
  });
});

describe("parseAtlanticoPrices", () => {
  it("parses per-person prices", () => {
    expect(parseAtlanticoPrices("36.00|19.00|0.00|10.80|5.70|0.00", "0")).toEqual({
      kind: "perPerson",
      adult: 36,
      child: 19,
      infant: 0,
      adultCommission: 10.8,
      childCommission: 5.7,
      infantCommission: 0,
    });
  });

  it("parses quoted loadPrices bodies used by the live testapi", () => {
    expect(parseAtlanticoPrices(TESTAPI_QUOTED_PIPES, "0")).toMatchObject({
      kind: "perPerson",
      adult: 42,
      child: 30,
      infant: 0,
    });
  });

  it("parses production PVPA objects end-to-end", () => {
    const raw = normalizeAtlanticoPriceRaw(PROD_PVPA_BODY);
    expect(parseAtlanticoPrices(raw, "0")).toEqual({
      kind: "perPerson",
      adult: 44,
      child: 32,
      infant: 0,
      adultCommission: 6.6,
      childCommission: 4.8,
      infantCommission: 0,
    });
  });

  it("returns null for empty API placeholders instead of €0 unique", () => {
    expect(parseAtlanticoPrices("[]", "0")).toBeNull();
    expect(parseAtlanticoPrices("|||||", "0")).toBeNull();
    expect(parseAtlanticoPrices("", "0")).toBeNull();
  });

  it("parses per-day tiers", () => {
    expect(
      parseAtlanticoPrices("3|36.00|19.00|7|110.80|35.70", "2")
    ).toEqual({
      kind: "perDay",
      tiers: [
        { days: 3, price: 36, commission: 19 },
        { days: 7, price: 110.8, commission: 35.7 },
      ],
    });
  });

  it("parses unique/product prices", () => {
    expect(parseAtlanticoPrices("58.00|12.00", "3")).toEqual({
      kind: "unique",
      price: 58,
      commission: 12,
    });
  });
});

describe("estimateBookingTotal", () => {
  it("multiplies per-person rates", () => {
    const prices = parseAtlanticoPrices("36.00|19.00|0.00|10.80|5.70|0.00", "0");
    expect(estimateBookingTotal(prices, 2, 1, 0)).toBe(91);
  });

  it("charges child-only bookings (Siam Ticket regression)", () => {
    const prices = parseAtlanticoPrices(
      normalizeAtlanticoPriceRaw(PROD_PVPA_BODY),
      "0"
    );
    expect(estimateBookingTotal(prices, 0, 1, 0)).toBe(32);
    expect(estimateBookingTotal(prices, 1, 0, 0)).toBe(44);
    expect(estimateBookingTotal(prices, 2, 1, 0)).toBe(120);
  });

  it("does not treat missing prices as Total €0", () => {
    expect(estimateBookingTotal(null, 0, 1, 0)).toBeNull();
    expect(estimateBookingTotal(parseAtlanticoPrices("[]", "0"), 0, 1, 0)).toBeNull();
  });

  it("returns null when no guests are selected", () => {
    const prices = parseAtlanticoPrices("42.00|30.00|0.00|6.30|4.50|0.00", "0");
    expect(estimateBookingTotal(prices, 0, 0, 0)).toBeNull();
  });
});

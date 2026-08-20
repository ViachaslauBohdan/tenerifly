import { describe, expect, it } from "vitest";
import { estimateBookingTotal, parseAtlanticoPrices } from "./prices";

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
});

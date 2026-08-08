import { describe, expect, it } from "vitest";
import {
  getHomeCarCurrency,
  getHomeCarFeatures,
  getHomeCarPrice,
} from "@/components/home/homeCars";
import type { HomeCar } from "@/components/home/types";

const baseCar: HomeCar = {
  title: "Test Car",
  rental_prices: {
    day_1: 69,
    currency: "EUR",
  },
  specifications: {
    make: "KIA",
    model: "Picanto",
    fuel: "petrol",
    transmission: "manual",
  },
  type: "rent",
};

describe("homeCars helpers", () => {
  it("reads daily rental price from rental_prices.day_1", () => {
    expect(getHomeCarPrice(baseCar)).toBe(69);
  });

  it("falls back to price when rental_prices.day_1 is missing", () => {
    expect(getHomeCarPrice({ title: "X", price: "42" })).toBe(42);
  });

  it("returns 0 for invalid prices", () => {
    expect(getHomeCarPrice({ title: "X", price: "nope" })).toBe(0);
  });

  it("maps currency labels when provided", () => {
    expect(getHomeCarCurrency(baseCar, { EUR: "€" })).toBe("€");
  });

  it("defaults currency to €", () => {
    expect(getHomeCarCurrency({ title: "X" })).toBe("€");
  });

  it("joins car features and falls back to an em dash", () => {
    expect(getHomeCarFeatures(baseCar)).toBe(
      "KIA • Picanto • rent • petrol • manual"
    );
    expect(getHomeCarFeatures({ title: "Empty" })).toBe("—");
  });
});

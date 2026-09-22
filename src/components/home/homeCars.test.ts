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

  it("turns a bare EUR code into €", () => {
    expect(getHomeCarCurrency(baseCar)).toBe("€");
  });

  it("defaults currency to €", () => {
    expect(getHomeCarCurrency({ title: "X" })).toBe("€");
  });

  it("joins car features and localizes transmission", () => {
    expect(getHomeCarFeatures(baseCar, "en")).toBe(
      "KIA • Picanto • rent • petrol • Manual"
    );
    expect(getHomeCarFeatures(baseCar, "pl")).toBe(
      "KIA • Picanto • rent • petrol • Manualna"
    );
    expect(
      getHomeCarFeatures(
        {
          ...baseCar,
          specifications: { ...baseCar.specifications, transmission: "automatic" },
        },
        "pl"
      )
    ).toBe("KIA • Picanto • rent • petrol • Automatyczna");
    expect(getHomeCarFeatures({ title: "Empty" })).toBe("—");
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import translationsJson from "@/i18n/main.json";
import { pickLocaleBundle } from "@/types/locale";
import { HomeCarsSection } from "./HomeCarsSection";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/HomeCardImage", () => ({
  HomeCardImage: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("@/lib/canariasAffiliate", () => ({
  getCanariasRentacarAffiliateUrl: () => "https://example.com",
  getCanariasRentacarBannerImageUrl: () => "https://example.com/banner.jpg",
}));

afterEach(() => {
  cleanup();
});

const pl = pickLocaleBundle(translationsJson, "pl");

const automaticCar = {
  documentId: "bmw",
  title: "BMW 420 Cabrio Aut. 2024",
  description: "Kabriolet",
  image: "https://example.com/car.jpg",
  specifications: {
    make: "BMW",
    model: "420",
    fuel: "petrol",
    transmission: "automatic",
  },
  rental_prices: { day_1: 120, currency: "EUR" },
  rating: 4.5,
};

describe("HomeCarsSection transmission locale", () => {
  it("shows Polish Automatyczna instead of CMS automatic", () => {
    render(
      <HomeCarsSection
        items={[automaticCar]}
        dataLoading={false}
        language="pl"
        copy={pl.sections.cars}
        common={pl.common}
        carsHref="/pl/cars"
        createLocaleLink={(path) => `/pl${path}`}
        onBook={vi.fn()}
      />
    );

    expect(screen.getAllByText(/Automatyczna/).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/^automatic$/i)).not.toBeInTheDocument();
  });

  it("shows Ukrainian Автомат for ua", () => {
    const ua = pickLocaleBundle(translationsJson, "ua");
    render(
      <HomeCarsSection
        items={[automaticCar]}
        dataLoading={false}
        language="ua"
        copy={ua.sections.cars}
        common={ua.common}
        carsHref="/ua/cars"
        createLocaleLink={(path) => `/ua${path}`}
        onBook={vi.fn()}
      />
    );

    expect(screen.getAllByText(/Автомат/).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/^automatic$/i)).not.toBeInTheDocument();
  });
});

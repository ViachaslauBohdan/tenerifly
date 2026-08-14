import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import translationsJson from "@/i18n/cars.json";
import { pickLocaleBundle } from "@/types/locale";

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    locale: "pl",
    createLocaleLink: (path: string) => `/pl${path}`,
  }),
}));

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/components/DeferredSimpleBookingPopup", () => ({
  DeferredSimpleBookingPopup: () => null,
}));

afterEach(() => {
  cleanup();
});

const plCopy = pickLocaleBundle(translationsJson, "pl");

const automaticCar = {
  id: 1,
  documentId: "bmw",
  title: "BMW 420 Cabrio Aut. 2024",
  slug: null,
  description: "Kabriolet",
  type: "rent" as const,
  car_status: "available" as const,
  featured: false,
  createdAt: "",
  updatedAt: "",
  publishedAt: "",
  images: [{ id: 1, url: "https://example.com/a.jpg" }],
  rental_prices: { day_1: 120, month: 2000, currency: "EUR" },
  specifications: {
    make: "BMW",
    model: "420",
    year: 2024,
    fuel: "petrol",
    transmission: "automatic",
    power: 180,
    seats: 4,
    doors: 2,
    color: "grey",
    body_type: "convertible",
    drive_type: "rwd",
  },
  location: null,
  contact: null,
};

describe("CarCard transmission locale", () => {
  it("shows Polish Automatyczna instead of CMS automatic", async () => {
    const CarCard = (await import("./CarCard")).default;

    render(
      <CarCard translations={plCopy} language="pl" cars={[automaticCar]} />
    );

    expect(screen.getByText("Automatyczna")).toBeInTheDocument();
    expect(screen.queryByText(/^automatic$/i)).not.toBeInTheDocument();
  });

  it("shows Manualna for manual gearbox", async () => {
    const CarCard = (await import("./CarCard")).default;

    render(
      <CarCard
        translations={plCopy}
        language="pl"
        cars={[
          {
            ...automaticCar,
            specifications: {
              ...automaticCar.specifications,
              transmission: "manual",
            },
          },
        ]}
      />
    );

    expect(screen.getByText("Manualna")).toBeInTheDocument();
  });
});

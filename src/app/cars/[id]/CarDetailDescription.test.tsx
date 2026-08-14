import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    locale: "ua",
    createLocaleLink: (path: string) => `/ua${path}`,
  }),
}));

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/ua/cars/test",
}));

vi.mock("@/components/DeferredSimpleBookingPopup", () => ({
  DeferredSimpleBookingPopup: () => null,
}));

vi.mock("@/components/CatalogDetailShell", () => ({
  CatalogDetailShell: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/CatalogBackLink", () => ({
  CatalogBackLink: () => null,
}));

vi.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CarouselContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CarouselItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CarouselNext: () => null,
  CarouselPrevious: () => null,
}));

afterEach(() => {
  cleanup();
});

describe("CarDetailPageClient description localization", () => {
  it("shows Ukrainian UI label and CMS description body as provided", async () => {
    const CarDetailPageClient = (await import("./client")).default;

    render(
      <CarDetailPageClient
        car={{
          id: 1,
          documentId: "bmw-test",
          title: "BMW 420 Cabrio Aut. 2024",
          slug: null,
          description:
            "Найновіший кабріолет BMW 2024 року з автоматичною коробкою передач.",
          type: "rent",
          car_status: "available",
          featured: false,
          createdAt: "",
          updatedAt: "",
          publishedAt: "",
          images: [],
          rental_prices: {
            day_1: 120,
            month: 2000,
            currency: "EUR",
          },
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
          features: null,
          location: null,
          contact: null,
        }}
      />
    );

    expect(screen.getByRole("heading", { name: "Опис" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Найновіший кабріолет BMW 2024 року з автоматичною коробкою передач."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Автомат", { exact: true })).toBeInTheDocument();
    expect(screen.queryByText(/^automatic$/i)).not.toBeInTheDocument();
  });
});

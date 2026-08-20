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
  usePathname: () => "/ua/apartments/test",
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

describe("PropertyDetailPageClient description localization", () => {
  it("shows Ukrainian UI label while CMS body can remain English until translated", async () => {
    const PropertyDetailPageClient = (
      await import("./PropertyDetailPageClient")
    ).default;

    render(
      <PropertyDetailPageClient
        property={{
          id: 1,
          documentId: "duplex-test",
          title: "Sunny Duplex in Playa de San Juan",
          slug: null,
          description:
            "Sunny Duplex in Playa de San Juan Dream Homes Tenerife present you this bright apartment.",
          type: "rent",
          property_status: "available",
          featured: false,
          category: "apartment",
          createdAt: "",
          updatedAt: "",
          publishedAt: "",
          images: [],
          price: { amount: 70, currency: "EUR", period: "day" },
          location: {
            address: "Playa de San Juan",
            city: "Guía de Isora",
            region: "Tenerife",
            postal_code: "38687",
            latitude: 0,
            longitude: 0,
          },
          features: null,
          specifications: {
            total_area: 80,
            living_area: 70,
            bedrooms: 2,
            bathrooms: 1,
            floor: 1,
            total_floors: 2,
          },
          rental_terms: null,
          contact: null,
        }}
      />
    );

    expect(screen.getByRole("heading", { name: "Опис" })).toBeInTheDocument();
    expect(
      screen.getByText(/Sunny Duplex in Playa de San Juan Dream Homes/)
    ).toBeInTheDocument();
  });

  it("rewrites a retired listing WhatsApp number to the work number", async () => {
    const PropertyDetailPageClient = (
      await import("./PropertyDetailPageClient")
    ).default;

    render(
      <PropertyDetailPageClient
        property={{
          id: 1,
          documentId: "duplex-test",
          title: "Sunny Duplex in Playa de San Juan",
          slug: null,
          description: "Bright apartment.",
          type: "rent",
          property_status: "available",
          featured: false,
          category: "apartment",
          createdAt: "",
          updatedAt: "",
          publishedAt: "",
          images: [],
          price: { amount: 70, currency: "EUR", period: "day" },
          location: null,
          features: null,
          specifications: null,
          rental_terms: null,
          contact: {
            name: "Adam",
            email: "adam@example.com",
            phone: "+34613211069",
            whatsapp: "+34613211069",
            preferred_contact: "whatsapp",
          },
        }}
      />
    );

    expect(screen.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute(
      "href",
      "https://wa.me/34604972372"
    );
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
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

  it("shows a write-to-manager button that opens WhatsApp/Telegram with the title", async () => {
    const user = userEvent.setup();
    const PropertyDetailPageClient = (
      await import("./PropertyDetailPageClient")
    ).default;

    render(
      <MantineProvider>
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
      </MantineProvider>
    );

    expect(
      screen.getByRole("button", { name: /Дізнатися точну ціну/i })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /Написати менеджеру/i })
    );

    const whatsapp = await screen.findByTestId("apartment-manager-whatsapp");
    const telegram = screen.getByTestId("apartment-manager-telegram");
    expect(whatsapp).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\/wa\.me\/34604972372\?text=/)
    );
    expect(telegram).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\/t\.me\/adamsvts\?text=/)
    );
    expect(decodeURIComponent(whatsapp.getAttribute("href")!)).toContain(
      "Sunny Duplex in Playa de San Juan"
    );
  });

  it("still shows the manager CTA when listing contact is missing", async () => {
    const PropertyDetailPageClient = (
      await import("./PropertyDetailPageClient")
    ).default;

    render(
      <PropertyDetailPageClient
        property={{
          id: 2,
          documentId: "no-contact",
          title: "Ocean View Studio",
          slug: null,
          description: "Studio.",
          type: "rent",
          property_status: "available",
          featured: false,
          category: "apartment",
          createdAt: "",
          updatedAt: "",
          publishedAt: "",
          images: [],
          price: { amount: 55, currency: "EUR", period: "day" },
          location: null,
          features: null,
          specifications: null,
          rental_terms: null,
          contact: null,
        }}
      />
    );

    expect(
      screen.getByRole("button", { name: /Написати менеджеру/i })
    ).toBeInTheDocument();
  });
});

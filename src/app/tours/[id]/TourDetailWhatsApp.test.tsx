import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    locale: "en",
    createLocaleLink: (path: string) => `/en${path}`,
  }),
}));

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/en/tours/test",
}));

vi.mock("@/components/DeferredSimpleBookingPopup", () => ({
  DeferredSimpleBookingPopup: () => null,
}));

vi.mock("@/components/ExcursionsIntermediaryNotice", () => ({
  ExcursionsIntermediaryNotice: () => null,
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

describe("TourDetailPageClient WhatsApp", () => {
  it("rewrites a retired listing WhatsApp number to the work number", async () => {
    const TourDetailPageClient = (await import("./client")).default;

    render(
      <TourDetailPageClient
        tour={{
          id: 1,
          documentId: "teide-test",
          title: "Teide National Park",
          slug: "teide-national-park",
          description: "Volcano tour.",
          duration: "8 hours",
          language: "en",
          available_days: null,
          createdAt: "",
          updatedAt: "",
          publishedAt: "",
          images: [],
          location: null,
          price: { amount: 80, currency: "EUR", period: "person" },
          contact: {
            name: "Office",
            email: "office@example.com",
            phone: "+34656641433",
            whatsapp: "+34656641433",
            telegram: "",
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

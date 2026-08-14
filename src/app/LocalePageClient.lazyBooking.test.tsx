import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    locale: "en",
    switchLocale: vi.fn(),
    createLocaleLink: (path: string) => `/en${path}`,
  }),
}));

vi.mock("./useDataLoader", () => ({
  useDataLoader: () => ({
    cars: [],
    accommodation: [],
    blogPosts: [],
    transfers: [],
    dataLoading: false,
  }),
}));

vi.mock("@/components/SiteHeader", () => ({
  SiteHeader: () => <header data-testid="site-header" />,
}));

vi.mock("@/components/home/HomeHeroSection", () => ({
  HomeHeroSection: () => <section data-testid="home-hero" />,
}));

vi.mock("@/components/home/HomeAccommodationSection", () => ({
  HomeAccommodationSection: ({
    onBook,
  }: {
    onBook: (item: { title: string; price?: string }) => void;
  }) => (
    <button
      type="button"
      onClick={() => onBook({ title: "Villa Azul", price: "€120" })}
    >
      Book accommodation
    </button>
  ),
}));

vi.mock("@/components/home/HomeCarsSection", () => ({
  HomeCarsSection: () => null,
}));

vi.mock("@/components/home/HomeTransfersSection", () => ({
  HomeTransfersSection: () => null,
}));

vi.mock("@/components/home/HomeExcursionsSection", () => ({
  HomeExcursionsSection: () => null,
}));

vi.mock("@/components/home/HomeBlogSection", () => ({
  HomeBlogSection: () => null,
}));

vi.mock("@/components/home/HomeFaqSection", () => ({
  HomeFaqSection: () => null,
}));

vi.mock("@/components/home/HomeFooter", () => ({
  HomeFooter: () => <footer data-testid="home-footer" />,
}));

vi.mock("@/components/DeferredSimpleBookingPopup", () => ({
  DeferredSimpleBookingPopup: ({
    opened,
    item,
  }: {
    opened: boolean;
    item: { name: string };
  }) => (
    <div data-testid="simple-booking-popup" data-opened={String(opened)}>
      {item.name}
    </div>
  ),
  preloadSimpleBookingPopup: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/en",
  useSearchParams: () => new URLSearchParams(),
}));

afterEach(() => {
  cleanup();
});

describe("LocalePageClient lazy booking popup", () => {
  it("does not mount the booking popup until a book action opens it", async () => {
    const user = userEvent.setup();
    const { LocalePageClient } = await import("./LocalePageClient");

    render(
      <LocalePageClient
        locale="en"
        initialData={{
          cars: [],
          properties: [],
          blogs: [],
          transfers: [],
        }}
      />
    );

    expect(screen.queryByTestId("simple-booking-popup")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Book accommodation" }));

    await waitFor(() => {
      expect(screen.getByTestId("simple-booking-popup")).toBeInTheDocument();
    });
    expect(screen.getByTestId("simple-booking-popup")).toHaveAttribute(
      "data-opened",
      "true"
    );
    expect(screen.getByText("Villa Azul")).toBeInTheDocument();
  });
});

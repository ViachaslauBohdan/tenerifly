import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const homeBlogSection = vi.fn(() => <div data-testid="home-blog-section" />);

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
    blogPosts: [
      {
        documentId: "post-1",
        title: "Hidden post",
        description: "Should not render",
      },
    ],
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
  HomeAccommodationSection: () => null,
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
  HomeBlogSection: (props: unknown) => homeBlogSection(props),
}));

vi.mock("@/components/home/HomeFaqSection", () => ({
  HomeFaqSection: () => <section data-testid="home-faq" />,
}));

vi.mock("@/components/home/HomeFooter", () => ({
  HomeFooter: () => <footer data-testid="home-footer" />,
}));

vi.mock("@/components/DeferredSimpleBookingPopup", () => ({
  DeferredSimpleBookingPopup: () => null,
  preloadSimpleBookingPopup: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/en",
  useSearchParams: () => new URLSearchParams(),
}));

afterEach(() => {
  cleanup();
  homeBlogSection.mockClear();
});

describe("LocalePageClient hidden blog", () => {
  it("does not render the home blog section even when posts are loaded", async () => {
    const { LocalePageClient } = await import("./LocalePageClient");

    render(
      <LocalePageClient
        locale="en"
        initialData={{
          cars: [],
          properties: [],
          blogs: [
            {
              documentId: "post-1",
              title: "Hidden post",
              description: "Should not render",
            },
          ],
          transfers: [],
        }}
      />
    );

    expect(screen.queryByTestId("home-blog-section")).not.toBeInTheDocument();
    expect(homeBlogSection).not.toHaveBeenCalled();
    expect(screen.getByTestId("home-faq")).toBeInTheDocument();
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./SiteHeader";

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
});

afterEach(() => {
  cleanup();
});

describe("SiteHeader without blog", () => {
  const headerProps = {
    language: "en" as const,
    onLanguageChange: vi.fn(),
    selectLanguageLabel: "Language",
    tabLabels: {
      accommodation: "Stays",
      cars: "Cars",
      excursions: "Tours",
      blog: "Blog",
    },
    createLocaleLink: (path: string) => `/en${path}`,
  };

  it("does not show a Blog nav link on home or in the menu", () => {
    render(<SiteHeader {...headerProps} variant="home" />);

    expect(screen.queryByRole("link", { name: "Blog" })).not.toBeInTheDocument();
    expect(screen.queryByText("Blog")).not.toBeInTheDocument();
    expect(screen.getAllByText("Cars").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Tours").length).toBeGreaterThan(0);
  });

  it("does not link to /blog or #blog on catalog pages", () => {
    render(<SiteHeader {...headerProps} variant="standalone" />);

    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href") ?? "");
    expect(
      hrefs.some(
        (href) => href.includes("#blog") || /(?:^|\/)blog(?:\/|$|\?)/.test(href)
      )
    ).toBe(false);
  });
});

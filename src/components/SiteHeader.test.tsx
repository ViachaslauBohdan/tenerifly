import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./SiteHeader";

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: true,
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
  createLocaleLink: (path: string) => {
    if (path === "/") return "/en/";
    return `/en${path.startsWith("/") ? path : `/${path}`}`;
  },
};

describe("SiteHeader navigation", () => {
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

  it("uses #excursions anchors on the home header and calls the scroll handler", async () => {
    const user = userEvent.setup();
    const onScrollToSection = vi.fn(
      () => (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
      }
    );

    render(
      <SiteHeader
        {...headerProps}
        variant="home"
        onScrollToSection={onScrollToSection}
      />
    );

    const toursLinks = screen.getAllByRole("link", { name: "Tours" });
    expect(toursLinks.some((link) => link.getAttribute("href") === "#excursions")).toBe(
      true
    );

    await user.click(toursLinks[0]);
    expect(onScrollToSection).toHaveBeenCalledWith("excursions");
  });

  it("links author tours to the home section", async () => {
    const user = userEvent.setup();
    const onScrollToSection = vi.fn(
      () => (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
      }
    );

    render(
      <SiteHeader
        {...headerProps}
        variant="home"
        onScrollToSection={onScrollToSection}
      />
    );

    const links = screen.getAllByRole("link", { name: "Author tours" });
    expect(links.some((link) => link.getAttribute("href") === "#author-tours")).toBe(
      true
    );
    await user.click(links[0]);
    expect(onScrollToSection).toHaveBeenCalledWith("author-tours");
  });

  it("points section links at the locale home hash on standalone pages", () => {
    render(<SiteHeader {...headerProps} variant="standalone" />);

    const toursLinks = screen.getAllByRole("link", { name: "Tours" });
    expect(
      toursLinks.some((link) => link.getAttribute("href") === "/en/#excursions")
    ).toBe(true);

    const homeHrefs = screen
      .getAllByRole("link", { name: "Home" })
      .map((link) => link.getAttribute("href") ?? "");
    expect(homeHrefs.some((href) => /^\/en\/?$/.test(href))).toBe(true);
  });

  it("notifies the parent when the language select changes", async () => {
    const user = userEvent.setup();
    const onLanguageChange = vi.fn();

    render(
      <SiteHeader
        {...headerProps}
        onLanguageChange={onLanguageChange}
        variant="home"
      />
    );

    const selects = screen.getAllByLabelText("Language");
    await user.selectOptions(selects[0], "es");
    expect(onLanguageChange).toHaveBeenCalledWith("es");
  });
});

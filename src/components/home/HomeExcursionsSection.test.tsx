import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomeExcursionsSection } from "./HomeExcursionsSection";

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    createLocaleLink: (path: string) => `/en${path}`,
  }),
}));

vi.mock("@/components/atlantico/AtlanticoCategoriesHeading", () => ({
  AtlanticoCategoriesHeading: () => <h2>Main categories</h2>,
}));

vi.mock("@/components/atlantico/AtlanticoExcursionsByChannel", () => ({
  AtlanticoExcursionsByChannel: ({
    api,
  }: {
    api: React.ReactNode;
  }) => <div data-testid="catalog-switch">{api}</div>,
}));

vi.mock("@/components/atlantico/AtlanticoCategoryCard", () => ({
  AtlanticoCategoryCard: ({
    classification,
    href,
  }: {
    classification: { name: string };
    href: string;
  }) => <a href={href}>tile:{classification.name}</a>,
}));

vi.mock("@/components/ViewAllLink", () => ({
  ViewAllLink: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

const copy = {
  title: "Excursions",
  viewAll: "View all",
} as never;

describe("HomeExcursionsSection navigation", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("links category tiles and View all into the locale tours catalog", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          classifications: [
            { id: "20", code: "20", name: "Coach Tours", count: 3 },
          ],
        }),
      }))
    );

    render(
      <HomeExcursionsSection
        language="en"
        copy={copy}
        intermediaryNotice=""
        toursHref="/en/tours"
      />
    );

    expect(screen.getByTestId("catalog-switch")).toBeInTheDocument();
    const tile = await screen.findByRole("link", { name: /tile:Coach Tours/i });
    expect(tile).toHaveAttribute("href", "/en/tours?category=20");
    expect(screen.getByRole("link", { name: /View all/i })).toHaveAttribute(
      "href",
      "/en/tours"
    );
  });
});

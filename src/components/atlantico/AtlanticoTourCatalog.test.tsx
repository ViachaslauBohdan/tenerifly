import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParams,
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    createLocaleLink: (path: string) => `/en${path}`,
  }),
}));

vi.mock("@/components/atlantico/AtlanticoCategoriesHeading", () => ({
  AtlanticoCategoriesHeading: () => <h1>Main categories</h1>,
}));

vi.mock("@/components/atlantico/AtlanticoExcursionsByChannel", () => ({
  AtlanticoExcursionsByChannel: ({
    api,
  }: {
    api: React.ReactNode;
  }) => <>{api}</>,
}));

vi.mock("@/components/atlantico/AtlanticoIframeBooking", () => ({
  AtlanticoIframeBooking: () => <iframe title="iframe catalog" />,
}));

vi.mock("@/components/atlantico/AtlanticoCategoryCard", () => ({
  AtlanticoCategoryCard: ({
    classification,
    href,
  }: {
    classification: { name: string };
    href: string;
  }) => <a href={href}>category:{classification.name}</a>,
}));

vi.mock("@/components/atlantico/AtlanticoTourCard", () => ({
  AtlanticoTourCard: ({
    tour,
    href,
  }: {
    tour: { name: string };
    href: string;
  }) => <a href={href}>tour:{tour.name}</a>,
}));

vi.mock("@/components/CatalogBackLink", () => ({
  CatalogBackLink: ({ href, label }: { href: string; label: string }) => (
    <a href={href}>{label}</a>
  ),
}));

import { AtlanticoTourCatalog } from "./AtlanticoTourCatalog";

describe("AtlanticoTourCatalog navigation", () => {
  afterEach(() => {
    cleanup();
    searchParams.delete("category");
    vi.unstubAllGlobals();
  });

  it("links categories into /tours?category=…", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo) => {
        const url = String(input);
        if (url.includes("/api/atlantico/classifications")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              classifications: [
                { id: "20", code: "20", name: "Coach Tours", count: 4 },
              ],
            }),
          };
        }
        return { ok: false, status: 404, json: async () => ({}) };
      })
    );

    render(<AtlanticoTourCatalog locale="en" />);

    const link = await screen.findByRole("link", { name: /category:Coach Tours/i });
    expect(link).toHaveAttribute("href", "/en/tours?category=20");
  });

  it("links tours to /tours/{code} and back to the category list", async () => {
    searchParams.set("category", "20");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo) => {
        const url = String(input);
        if (url.includes("/api/atlantico/classifications")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              classifications: [
                { id: "20", code: "20", name: "Coach Tours", count: 4 },
              ],
            }),
          };
        }
        if (url.includes("/api/atlantico/tours")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              tours: [{ id: "12", code: "12", name: "Teide Masca", price: "36.00" }],
            }),
          };
        }
        return { ok: false, status: 404, json: async () => ({}) };
      })
    );

    render(<AtlanticoTourCatalog locale="en" />);

    const tour = await screen.findByRole("link", { name: /tour:Teide Masca/i });
    expect(tour).toHaveAttribute("href", "/en/tours/12");

    const back = screen.getByRole("link", { name: /All categories/i });
    expect(back).toHaveAttribute("href", "/en/tours");
  });
});

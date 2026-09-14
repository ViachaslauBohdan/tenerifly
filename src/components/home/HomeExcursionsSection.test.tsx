import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomeExcursionsSection } from "./HomeExcursionsSection";

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    createLocaleLink: (path: string) => path,
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
  AtlanticoCategoryCard: ({ classification }: { classification: { name: string } }) => (
    <div>tile:{classification.name}</div>
  ),
}));

const copy = {
  title: "Excursions",
  viewAll: "View all",
} as never;

describe("HomeExcursionsSection", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("delegates catalog switching and mounts API tiles as the api branch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          classifications: [
            { id: "1", code: "20", name: "Coach Tours", count: 3 },
          ],
        }),
      }))
    );

    render(
      <HomeExcursionsSection
        language="en"
        copy={copy}
        intermediaryNotice=""
        toursHref="/tours"
      />
    );

    expect(screen.getByTestId("catalog-switch")).toBeInTheDocument();
    expect(await screen.findByText(/tile:Coach Tours/i)).toBeInTheDocument();
  });
});

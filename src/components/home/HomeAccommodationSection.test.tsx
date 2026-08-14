import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import translationsJson from "@/i18n/main.json";
import { pickLocaleBundle } from "@/types/locale";
import { HomeAccommodationSection } from "./HomeAccommodationSection";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/HomeCardImage", () => ({
  HomeCardImage: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

afterEach(() => {
  cleanup();
});

const pl = pickLocaleBundle(translationsJson, "pl");

describe("HomeAccommodationSection localized CMS copy", () => {
  it("renders overlayed Polish titles and descriptions", () => {
    render(
      <HomeAccommodationSection
        items={[
          {
            documentId: "feat",
            title: "Apartament z widokiem Los Gigantes",
            description: "Polski opis apartamentu",
            location: "Los Gigantes",
            amenities: "WiFi",
            price: "70 EUR / dzień",
            rating: 4.5,
          },
        ]}
        dataLoading={false}
        copy={pl.sections.accommodation}
        common={pl.common}
        apartmentsHref="/pl/apartments"
        createLocaleLink={(path) => `/pl${path}`}
        onBook={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: "Apartament z widokiem Los Gigantes",
      })
    ).toBeInTheDocument();
    expect(screen.getByText("Polski opis apartamentu")).toBeInTheDocument();
    expect(
      screen.queryByText("Fantastic View Los Gigantes Apartment")
    ).not.toBeInTheDocument();
  });
});

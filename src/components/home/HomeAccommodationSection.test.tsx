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
const ru = pickLocaleBundle(translationsJson, "ru");

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
        language="pl"
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
    expect(screen.getByRole("button", { name: /Poznaj dokładną cenę/i })).toBeInTheDocument();
    expect(screen.getByText(/≈ 70 EUR/)).toBeInTheDocument();
    expect(
      screen.getByText(/Cena orientacyjna/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Fantastic View Los Gigantes Apartment")
    ).not.toBeInTheDocument();
  });

  it("offers a manager WhatsApp link next to the check-price CTA", () => {
    render(
      <HomeAccommodationSection
        items={[
          {
            documentId: "feat",
            title: "Пентхаус Puerto de Santiago",
            description: "Описание",
            location: "Puerto de Santiago",
            amenities: "WiFi",
            price: "≈ €180/день",
            rating: 5,
          },
        ]}
        dataLoading={false}
        copy={ru.sections.accommodation}
        common={ru.common}
        language="ru"
        apartmentsHref="/ru/apartments"
        createLocaleLink={(path) => `/ru${path}`}
        onBook={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: /Узнать точную цену/i })
    ).toBeInTheDocument();

    const manager = screen.getByRole("link", {
      name: /Связаться с менеджером/i,
    });
    expect(manager).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\/wa\.me\/34604972372\?text=/)
    );
    expect(decodeURIComponent(manager.getAttribute("href")!)).toContain(
      "Пентхаус Puerto de Santiago"
    );
  });
});

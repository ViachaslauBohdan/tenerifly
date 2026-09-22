import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import translationsJson from "@/i18n/apartments.json";
import { pickLocaleBundle } from "@/types/locale";

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    locale: "pl",
    createLocaleLink: (path: string) => `/pl${path}`,
  }),
}));

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/components/DeferredSimpleBookingPopup", () => ({
  DeferredSimpleBookingPopup: () => null,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const plCopy = pickLocaleBundle(translationsJson, "pl");

const polishRentProperty = {
  id: 1,
  documentId: "feat",
  title: "Odnowiony apartament Chayofa",
  slug: null,
  description:
    "Dream Homes Tenerife przedstawia nowo wyremontowany apartament.",
  type: "rent" as const,
  property_status: "available" as const,
  featured: true,
  category: "apartment",
  createdAt: "",
  updatedAt: "",
  publishedAt: "",
  images: [{ id: 1, url: "https://example.com/a.jpg" }],
  price: { amount: 70, currency: "EUR", period: "day" },
  location: {
    address: "",
    city: "Chayofa",
    region: "Tenerife",
    postal_code: "",
    latitude: 0,
    longitude: 0,
  },
  features: null,
  specifications: {
    total_area: 60,
    living_area: 50,
    bedrooms: 2,
    bathrooms: 1,
    floor: 1,
    total_floors: 2,
  },
  contact: null,
};

describe("ApartmentCard localized copy", () => {
  it("shows Polish CMS title, listing type, and from-price", async () => {
    const ApartmentCard = (await import("./ApartmentCard")).default;

    render(
      <ApartmentCard
        translations={plCopy}
        language="pl"
        apartments={[polishRentProperty]}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Odnowiony apartament Chayofa" })
    ).toBeInTheDocument();
    expect(screen.getByText("Na wynajem")).toBeInTheDocument();
    expect(screen.queryByText("For Rent")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /Dream Homes Tenerife przedstawia nowo wyremontowany apartament/
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Od ≈ €70\/dzień/)).toBeInTheDocument();
    expect(screen.queryByText(/FROM/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Poznaj dokładną cenę/i })).toBeInTheDocument();
    expect(screen.getByText(/Cena orientacyjna/i)).toBeInTheDocument();
  });

  it("shows Polish sale label", async () => {
    const ApartmentCard = (await import("./ApartmentCard")).default;

    render(
      <ApartmentCard
        translations={plCopy}
        language="pl"
        apartments={[{ ...polishRentProperty, type: "sale" }]}
      />
    );

    expect(screen.getByText("Na sprzedaż")).toBeInTheDocument();
    expect(screen.queryByText("For Sale")).not.toBeInTheDocument();
  });

  it("fetches the catalog with the mapped CMS locale", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ data: [polishRentProperty] }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const ApartmentCard = (await import("./ApartmentCard")).default;
    render(<ApartmentCard translations={plCopy} language="ua" />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain("locale=uk");
    expect(url).not.toContain("locale=ua");
    expect(url).toContain("pagination[pageSize]=1000");
  });
});

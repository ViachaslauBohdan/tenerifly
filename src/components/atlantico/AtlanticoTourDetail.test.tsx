import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AtlanticoTourDetail } from "./AtlanticoTourDetail";

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    locale: "en",
    createLocaleLink: (path: string) => path,
  }),
}));

vi.mock("@/components/CatalogBackLink", () => ({
  CatalogBackLink: ({ label }: { label: string }) => <a href="/tours">{label}</a>,
}));

vi.mock("@/components/CatalogDetailShell", () => ({
  CatalogDetailShell: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/ExcursionsIntermediaryNotice", () => ({
  ExcursionsIntermediaryNotice: () => null,
}));

vi.mock("./AtlanticoImage", () => ({
  AtlanticoImage: () => <div>image</div>,
}));

vi.mock("./AtlanticoBookingSection", () => ({
  AtlanticoBookingSection: () => <div>booking section</div>,
}));

vi.mock("@/lib/atlantico/bookingMode", () => ({
  isAtlanticoIframeBooking: vi.fn(),
}));

import { isAtlanticoIframeBooking } from "@/lib/atlantico/bookingMode";

const tour = {
  id: "14",
  code: "14",
  name: "Siam Park",
  price: "48.00",
  duration: "8",
};

describe("AtlanticoTourDetail booking layout", () => {
  afterEach(() => {
    cleanup();
    vi.mocked(isAtlanticoIframeBooking).mockReset();
  });

  it("uses a full-width booking aside for iframe mode", () => {
    vi.mocked(isAtlanticoIframeBooking).mockReturnValue(true);
    const { container } = render(
      <AtlanticoTourDetail tour={tour} events={[]} />
    );

    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("xl:col-span-4");
    expect(screen.getByText(/booking section/i)).toBeInTheDocument();
  });

  it("keeps a narrow sticky aside for api mode", () => {
    vi.mocked(isAtlanticoIframeBooking).mockReturnValue(false);
    const { container } = render(
      <AtlanticoTourDetail tour={tour} events={[]} />
    );

    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("xl:col-span-1");
    expect(container.querySelector(".xl\\:sticky")).not.toBeNull();
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomeTransfersSection } from "./HomeTransfersSection";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
  useLinkStatus: () => ({ pending: false }),
}));

vi.mock("@/components/HomeCardImage", () => ({
  HomeCardImage: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

afterEach(() => {
  cleanup();
});

const transfer = {
  id: 1,
  documentId: "sprinter-8",
  title: "Mercedes Sprinter 8 seats airport transfer",
  description: "Private airport transfer in Tenerife",
  seats: 8,
  price_south_airport: 50,
  price_north_airport: 100,
  currency: "EUR",
  image: "https://example.com/van.jpg",
};

describe("HomeTransfersSection locale copy", () => {
  it("shows Polish section title and subtitle, not English chrome", () => {
    render(
      <HomeTransfersSection
        transfers={[transfer]}
        language="pl"
        createLocaleLink={(path) => `/pl${path}`}
        onBook={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Transfery z lotniska" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Prywatne transfery na Teneryfie dla rodzin i grup")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Mercedes Sprinter 8 miejsc — transfer z lotniska" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Airport Transfers")).not.toBeInTheDocument();
  });

  it("shows Ukrainian section copy for ua", () => {
    render(
      <HomeTransfersSection
        transfers={[transfer]}
        language="ua"
        createLocaleLink={(path) => `/ua${path}`}
        onBook={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Трансфери з аеропорту" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Mercedes Sprinter 8 місць — трансфер з аеропорту",
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Mercedes Sprinter 8 seats airport transfer")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Airport Transfers")).not.toBeInTheDocument();
  });
});

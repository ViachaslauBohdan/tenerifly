import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AtlanticoTourCard } from "./AtlanticoTourCard";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/ViewDetailsLink", () => ({
  ViewDetailsLink: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

afterEach(() => {
  cleanup();
});

describe("AtlanticoTourCard", () => {
  it("shows tour name, from-price and details link", () => {
    render(
      <AtlanticoTourCard
        locale="en"
        href="/en/tours/12"
        tour={{
          id: "12",
          code: "12",
          name: "Teide Masca (GRAN TOUR)",
          desc: "<p>Coach tour</p>",
          image: "garachico-san-miguel1.jpg",
          price: "36.00",
          duration: "9",
        }}
      />
    );

    expect(
      screen.getByRole("heading", { name: /Teide Masca/ })
    ).toBeInTheDocument();
    expect(screen.getByText(/From/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view details/i })).toHaveAttribute(
      "href",
      "/en/tours/12"
    );
  });
});

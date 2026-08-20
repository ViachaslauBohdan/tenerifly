import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AtlanticoCategoryCard } from "./AtlanticoCategoryCard";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

afterEach(() => {
  cleanup();
});

describe("AtlanticoCategoryCard", () => {
  it("shows the category title, count badge and link", () => {
    render(
      <AtlanticoCategoryCard
        href="/en/tours?category=20"
        classification={{
          id: "1312481776",
          code: "20",
          name: "Coach Tours",
          image: "1312481776.jpg",
          count: 17,
        }}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Coach Tours" })
    ).toBeInTheDocument();
    expect(screen.getByText("17")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /coach tours/i })
    ).toHaveAttribute("href", "/en/tours?category=20");
  });

  it("omits the badge when there are no tours", () => {
    render(
      <AtlanticoCategoryCard
        href="/en/tours?category=131"
        classification={{
          id: "1394099409",
          code: "131",
          name: "Airport transfers",
          image: "1394099409.jpg",
          count: 0,
        }}
      />
    );

    expect(screen.getByRole("heading", { name: "Airport transfers" })).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});

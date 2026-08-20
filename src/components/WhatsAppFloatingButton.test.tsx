import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const usePathname = vi.fn(() => "/en");

vi.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
}));

import { WhatsAppFloatingButton } from "./WhatsAppFloatingButton";

afterEach(() => {
  cleanup();
  usePathname.mockReturnValue("/en");
});

describe("WhatsAppFloatingButton", () => {
  it("opens the work WhatsApp number on regular pages", () => {
    render(<WhatsAppFloatingButton />);

    expect(screen.getByRole("link", { name: "Contact us on WhatsApp" })).toHaveAttribute(
      "href",
      "https://wa.me/34604972372"
    );
  });

  it("keeps the world-tours WhatsApp number on that page", () => {
    usePathname.mockReturnValue("/en/world-tours");
    render(<WhatsAppFloatingButton />);

    expect(screen.getByRole("link", { name: "Contact us on WhatsApp" })).toHaveAttribute(
      "href",
      "https://wa.me/380959390292"
    );
  });
});

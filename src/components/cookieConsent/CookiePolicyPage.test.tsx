import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CookiePolicyPage } from "./CookiePolicyPage";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/en",
}));

vi.mock("@/components/CatalogDetailShell", () => ({
  CatalogDetailShell: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

afterEach(() => {
  cleanup();
});

describe("CookiePolicyPage", () => {
  it("names the controller, the ads tag, and how to withdraw consent", () => {
    render(<CookiePolicyPage />);

    expect(screen.getByRole("heading", { name: "Cookie policy" })).toBeInTheDocument();
    expect(screen.getAllByText(/PanaFera/).length).toBeGreaterThan(0);
    expect(screen.getByText(/AW-679583815/)).toBeInTheDocument();
    expect(screen.getByText(/atlantico_admin/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "https://www.aepd.es" })).toHaveAttribute(
      "href",
      "https://www.aepd.es"
    );
    expect(screen.getByText(/Cookie settings/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/en"
    );
  });
});

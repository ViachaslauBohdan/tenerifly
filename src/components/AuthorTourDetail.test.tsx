import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthorTourDetail } from "./AuthorTourDetail";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/ua/author-tours/tenerife-8-days",
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    locale: "ua",
    switchLocale: vi.fn(),
    createLocaleLink: (path: string) => `/ua${path.startsWith("/") ? path : `/${path}`}`,
    t: {
      selectLanguage: "Мова",
      hero: {
        tabs: {
          accommodation: "Житло",
          cars: "Авто",
          excursions: "Екскурсії",
          blog: "Блог",
        },
      },
    },
  }),
}));

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
});

describe("AuthorTourDetail", () => {
  it("shows the full Ukrainian programme instead of the Russian card copy", () => {
    render(<AuthorTourDetail tourId="tenerife-8-days" />);

    expect(
      screen.getByRole("heading", { name: /8 днів/ })
    ).toBeInTheDocument();
    expect(screen.getByText(/День 1\. Зустріч в аеропорту/)).toBeInTheDocument();
    expect(screen.getByText("Авіапереліт")).toBeInTheDocument();
    expect(screen.queryByText(/8 дней/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "До авторських турів" })
    ).toHaveAttribute("href", "/ua/#author-tours");
  });
});

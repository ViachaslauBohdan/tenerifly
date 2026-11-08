import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import translationsJson from "@/i18n/main.json";
import { pickLocaleBundle } from "@/types/locale";
import { HomeWorldToursSection } from "@/components/home/HomeWorldToursSection";

vi.mock("next/link", () => ({
  default: ({
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

const hero = pickLocaleBundle(translationsJson, "en").hero;

describe("HomeWorldToursSection", () => {
  it("shows the worldwide tour heading and links Find to the tours page", () => {
    render(<HomeWorldToursSection hero={hero} href="/en/world-tours" />);

    const section = document.getElementById("worldwide-tours");
    expect(section).not.toBeNull();
    expect(
      screen.getByRole("heading", { name: hero.worldTours.heading })
    ).toBeInTheDocument();
    expect(screen.getByText(hero.worldTours.hint)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: hero.searchGlobalTours })
    ).toHaveAttribute("href", "/en/world-tours");
    expect(section?.contains(
      screen.getByRole("heading", { name: hero.worldTours.heading })
    )).toBe(true);
  });
});

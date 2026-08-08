import type { ReactNode } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import translationsJson from "@/i18n/main.json";
import { pickLocaleBundle } from "@/types/locale";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import type { HeroTab } from "@/lib/heroTab";

vi.mock("@mantine/dates", () => ({
  DatesProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/HeroCompactDateInput", () => ({
  HeroCompactDateInput: ({
    "aria-label": ariaLabel,
  }: {
    "aria-label": string;
  }) => <button type="button" aria-label={ariaLabel} />,
}));

vi.mock("@/components/WorldToursHeroSearch", () => ({
  WorldToursHeroSearch: () => <div data-testid="world-tours-search" />,
}));

vi.mock("@/components/HeroSearchCta", () => ({
  HeroSearchCtaButton: ({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) => (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  ),
}));

afterEach(() => {
  cleanup();
});

const hero = pickLocaleBundle(translationsJson, "en").hero;

function renderHero(activeTab: HeroTab = "accommodation") {
  return render(
    <HomeHeroSection
      language="en"
      hero={hero}
      excursionsIntermediaryNotice=""
      worldToursHref="/en/world-tours"
      activeTab={activeTab}
      dates={["2026-08-08", "2026-08-13"]}
      guests={2}
      carType=""
      tourLanguage="en"
      onHeroTabChange={vi.fn()}
      onGuestsChange={vi.fn()}
      onCarTypeChange={vi.fn()}
      onTourLanguageChange={vi.fn()}
      onCheckInChange={vi.fn()}
      onCheckOutChange={vi.fn()}
      onSearch={vi.fn()}
    />
  );
}

function expectFullField(controlId: string) {
  const home = document.getElementById("home");
  expect(home).not.toBeNull();
  const label = home!.querySelector(`label[for="${controlId}"]`);
  const control = home!.querySelector(`#${controlId}`);
  expect(label).not.toBeNull();
  expect(control).not.toBeNull();
  expect(label).toContainElement(control as HTMLElement);
  expect(label?.className).toMatch(/cursor-pointer/);
}

describe("HomeHeroSection full input fields", () => {
  it("makes leisure and guests full-field labels without chevron icons", () => {
    renderHero("accommodation");

    expectFullField("hero-leisure");
    expectFullField("hero-guests");
    expect(
      document.querySelectorAll("#home svg.lucide-chevron-down")
    ).toHaveLength(0);
  });

  it("makes car body type a full-field label", () => {
    renderHero("cars");
    expectFullField("hero-car-body-type");
  });

  it("makes tour people and language full-field labels", () => {
    renderHero("tours");
    expectFullField("hero-people");
    expectFullField("hero-tour-language");
  });

  it("focuses guests select when the Guests field label is clicked", async () => {
    const user = userEvent.setup();
    renderHero("accommodation");

    const label = document.querySelector('label[for="hero-guests"]');
    expect(label).not.toBeNull();
    await user.click(within(label as HTMLElement).getByText(hero.accommodation.guests));
    expect(screen.getByLabelText(hero.accommodation.guests)).toHaveFocus();
  });

  it("focuses leisure select when the Leisure field label is clicked", async () => {
    const user = userEvent.setup();
    renderHero("accommodation");

    const leisureLabel = hero.leisure ?? "Leisure";
    const label = document.querySelector('label[for="hero-leisure"]');
    expect(label).not.toBeNull();
    await user.click(within(label as HTMLElement).getByText(leisureLabel));
    expect(screen.getByLabelText(leisureLabel)).toHaveFocus();
  });
});

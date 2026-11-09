import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import translationsJson from "@/i18n/main.json";
import { pickLocaleBundle } from "@/types/locale";
import { HomeFooter } from "./HomeFooter";

afterEach(() => {
  cleanup();
});

describe("HomeFooter contact number", () => {
  it("shows the work phone, not the retired personal number", () => {
    const copy = pickLocaleBundle(translationsJson, "en");

    render(
      <HomeFooter
        footer={copy.footer}
        excursionsTitle={copy.sections.excursions.title}
        cookiePolicyTitle="Cookie policy"
        createLocaleLink={(path) => path}
      />
    );

    const tel = screen.getByRole("link", { name: "+34604972372" });
    expect(tel).toHaveAttribute("href", "tel:+34604972372");
    expect(screen.queryByText("+34613211069")).not.toBeInTheDocument();
    expect(screen.queryByText("+34656641433")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cookie policy" })).toHaveAttribute(
      "href",
      "/cookies"
    );
  });

  it("links Instagram, Facebook, TikTok, and Google Maps in a new tab", () => {
    const copy = pickLocaleBundle(translationsJson, "en");

    render(
      <HomeFooter
        footer={copy.footer}
        excursionsTitle={copy.sections.excursions.title}
        createLocaleLink={(path) => path}
      />
    );

    const expected = [
      ["Instagram", "https://www.instagram.com/pana.fera"],
      [
        "Facebook",
        "https://www.facebook.com/people/TenerifeJoy-PanaFera/61595340874144/",
      ],
      ["TikTok", "https://www.tiktok.com/@pana.fera.ru"],
      ["Google Maps", "https://maps.app.goo.gl/TBbdVEqmjSkcTLEf6"],
    ] as const;

    for (const [name, href] of expected) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }

    expect(screen.getByRole("link", { name: "+34604972372" })).toHaveAttribute(
      "href",
      "tel:+34604972372"
    );
  });
});

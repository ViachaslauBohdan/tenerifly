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
        createLocaleLink={(path) => path}
      />
    );

    const tel = screen.getByRole("link", { name: "+34604972372" });
    expect(tel).toHaveAttribute("href", "tel:+34604972372");
    expect(screen.queryByText("+34613211069")).not.toBeInTheDocument();
    expect(screen.queryByText("+34656641433")).not.toBeInTheDocument();
  });
});

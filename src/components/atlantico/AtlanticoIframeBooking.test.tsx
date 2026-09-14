import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AtlanticoIframeBooking } from "./AtlanticoIframeBooking";

afterEach(() => {
  cleanup();
});

describe("AtlanticoIframeBooking", () => {
  it("embeds the EN affiliate white-label catalog with afId=3726", () => {
    render(<AtlanticoIframeBooking locale="en" />);

    const frame = screen.getByTitle(/Atlántico Excursiones catalog/i);
    expect(frame.tagName).toBe("IFRAME");
    expect(frame).toHaveAttribute(
      "src",
      "https://en.atlanticoexcursiones.com/index.php?afId=3726"
    );
    expect(
      screen.getByRole("link", { name: /open in a new tab/i })
    ).toHaveAttribute(
      "href",
      "https://en.atlanticoexcursiones.com/index.php?afId=3726"
    );
  });

  it("uses the Spanish www host for es locale", () => {
    render(<AtlanticoIframeBooking locale="es" />);

    expect(screen.getByTitle(/Catálogo Atlántico Excursiones/i)).toHaveAttribute(
      "src",
      "https://www.atlanticoexcursiones.com/index.php?afId=3726"
    );
  });

  it("maps unsupported site locales to the English catalog", () => {
    render(<AtlanticoIframeBooking locale="pl" />);

    expect(screen.getByTitle(/Katalog Atlántico Excursiones/i)).toHaveAttribute(
      "src",
      "https://en.atlanticoexcursiones.com/index.php?afId=3726"
    );
  });
});

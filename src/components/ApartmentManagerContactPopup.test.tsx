import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import { ApartmentManagerContactPopup } from "./ApartmentManagerContactPopup";

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
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ApartmentManagerContactPopup", () => {
  it("offers WhatsApp and Telegram links with the listing title in the prefill", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <MantineProvider>
        <ApartmentManagerContactPopup
          opened
          onClose={onClose}
          propertyTitle="Хостел номер Лос Кристианос рядом с пляжем"
          locale="ru"
        />
      </MantineProvider>
    );

    expect(screen.getByText(/Как написать/i)).toBeInTheDocument();

    const whatsapp = screen.getByTestId("apartment-manager-whatsapp");
    const telegram = screen.getByTestId("apartment-manager-telegram");

    expect(whatsapp).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\/wa\.me\/34604972372\?text=/)
    );
    expect(telegram).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\/t\.me\/adamsvts\?text=/)
    );

    const expected =
      "Здравствуйте! Интересует «Хостел номер Лос Кристианос рядом с пляжем». Подскажите цену и свободные даты.";
    expect(decodeURIComponent(whatsapp.getAttribute("href")!)).toContain(
      expected
    );
    expect(decodeURIComponent(telegram.getAttribute("href")!)).toContain(
      expected
    );

    expect(whatsapp).toHaveTextContent("WhatsApp");
    expect(telegram).toHaveTextContent("Telegram");
    await user.click(whatsapp);
    expect(onClose).not.toHaveBeenCalled();
  });
});

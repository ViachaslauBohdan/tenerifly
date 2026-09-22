import { cleanup, render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SimpleBookingPopup } from "./SimpleBookingPopup";

vi.mock("@mantine/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@mantine/hooks")>();
  return {
    ...actual,
    useMediaQuery: () => false,
  };
});

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

function renderPopup(variant: "default" | "apartment" = "apartment") {
  return render(
    <MantineProvider>
      <SimpleBookingPopup
        opened
        onClose={vi.fn()}
        item={{ name: "Hostel Los Cristianos", price: "≈ €70/день" }}
        mode="contact"
        variant={variant}
        currentLocale="ru"
      />
    </MantineProvider>
  );
}

describe("SimpleBookingPopup mobile layout", () => {
  it("keeps the send action outside the scroll area so it stays reachable", () => {
    renderPopup();

    expect(screen.getByText(/Запрос на бронирование/i)).toBeInTheDocument();

    const scroll = screen.getByTestId("simple-booking-scroll");
    const actions = screen.getByTestId("simple-booking-actions");
    const send = screen.getByRole("button", { name: /Отправить/i });

    expect(actions).toContainElement(send);
    expect(scroll).not.toContainElement(send);
    expect(scroll).toHaveStyle({ overflowY: "auto" });
  });

  it("shows apartment request steps, disclaimer, and localized country-first phone placeholder", () => {
    renderPopup("apartment");
    expect(screen.getByTestId("apartment-booking-steps")).toHaveTextContent(
      /Вы отправляете запрос/
    );
    expect(
      screen.getByText(/Ориентировочная цена/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Сначала выберите страну/i)
    ).toBeInTheDocument();
  });
});

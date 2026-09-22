import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomeAuthorToursSection } from "./HomeAuthorToursSection";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
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

describe("HomeAuthorToursSection", () => {
  it("shows both packaged tours with a fixed per-person price", () => {
    render(
      <HomeAuthorToursSection language="ru" onBook={vi.fn()} />
    );

    expect(
      screen.getByRole("heading", { name: "Авторские туры" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /8 дней/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /7 пляжей/i })
    ).toBeInTheDocument();
    expect(screen.getByText("700 €")).toBeInTheDocument();
    expect(screen.getByText("500 €")).toBeInTheDocument();
    expect(screen.getAllByText("с человека").length).toBeGreaterThan(0);
    expect(screen.getByText(/Авиаперелёт/)).toBeInTheDocument();
    expect(screen.queryByText(/≈/)).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: /8 дней/i })).toHaveAttribute(
      "src",
      "/author-tours/teide-landscape.jpg"
    );
    expect(screen.getByRole("img", { name: /7 пляжей/i })).toHaveAttribute(
      "src",
      "/author-tours/beach-landscape.jpg"
    );
  });

  it("opens a manager chat with the tour title", async () => {
    const user = userEvent.setup();
    render(
      <MantineProvider>
        <HomeAuthorToursSection language="ru" onBook={vi.fn()} />
      </MantineProvider>
    );

    const buttons = screen.getAllByRole("button", {
      name: /Написать менеджеру/i,
    });
    await user.click(buttons[0]);

    const whatsapp = await screen.findByTestId("apartment-manager-whatsapp");
    expect(decodeURIComponent(whatsapp.getAttribute("href")!)).toContain(
      "Авторский тур на Тенерифе — 8 дней"
    );
  });

  it("sends the selected tour into the request form", async () => {
    const user = userEvent.setup();
    const onBook = vi.fn();
    render(<HomeAuthorToursSection language="ru" onBook={onBook} />);

    await user.click(
      screen.getAllByRole("button", { name: /Узнать точную цену/i })[1]
    );

    expect(onBook).toHaveBeenCalledWith({
      title: "7 пляжей Тенерифе за 7 дней",
      price: "500 € с человека",
    });
  });
});

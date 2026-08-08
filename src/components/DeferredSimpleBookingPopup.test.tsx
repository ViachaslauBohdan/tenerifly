import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createNextDynamicMock } from "@/test/nextDynamicMock";

vi.mock("next/dynamic", async () => createNextDynamicMock());

vi.mock("@/components/SimpleBookingPopup", () => ({
  SimpleBookingPopup: ({
    opened,
    item,
  }: {
    opened: boolean;
    item: { name: string };
  }) => (
    <div data-testid="simple-booking-popup" data-opened={String(opened)}>
      {item.name}
    </div>
  ),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("DeferredSimpleBookingPopup", () => {
  it("lazy-loads SimpleBookingPopup and forwards props", async () => {
    const { DeferredSimpleBookingPopup } = await import(
      "@/components/DeferredSimpleBookingPopup"
    );

    render(
      <DeferredSimpleBookingPopup
        opened
        onClose={vi.fn()}
        item={{ name: "Villa Azul" }}
        mode="contact"
        currentLocale="en"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("simple-booking-popup")).toBeInTheDocument();
    });
    expect(screen.getByTestId("simple-booking-popup")).toHaveAttribute(
      "data-opened",
      "true"
    );
    expect(screen.getByText("Villa Azul")).toBeInTheDocument();
  });

  it("schedules an idle preload and exposes preloadSimpleBookingPopup", async () => {
    const idleCallbacks: Array<() => void> = [];
    vi.stubGlobal(
      "requestIdleCallback",
      (cb: IdleRequestCallback, _opts?: IdleRequestOptions) => {
        idleCallbacks.push(() =>
          cb({
            didTimeout: false,
            timeRemaining: () => 50,
          })
        );
        return 1;
      }
    );

    vi.resetModules();
    const mod = await import("@/components/DeferredSimpleBookingPopup");

    expect(idleCallbacks.length).toBe(1);
    expect(typeof mod.preloadSimpleBookingPopup).toBe("function");

    idleCallbacks[0]();
    mod.preloadSimpleBookingPopup();

    // Preload warms the chunk without mounting UI.
    expect(screen.queryByTestId("simple-booking-popup")).not.toBeInTheDocument();
  });
});

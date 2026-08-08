import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const preloadSimpleBookingPopup = vi.fn();

vi.mock("@/components/DeferredSimpleBookingPopup", () => ({
  preloadSimpleBookingPopup: () => preloadSimpleBookingPopup(),
}));

import { useBookingModal } from "@/components/home/useBookingModal";

describe("useBookingModal", () => {
  beforeEach(() => {
    preloadSimpleBookingPopup.mockClear();
  });

  it("preloads the booking popup on mount and when opening", () => {
    const { result } = renderHook(() => useBookingModal());

    expect(preloadSimpleBookingPopup).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.openBookingModal("accommodation", {
        title: "Villa Azul",
        price: "€120",
      });
    });

    expect(preloadSimpleBookingPopup).toHaveBeenCalledTimes(2);
    expect(result.current.isOpen).toBe(true);
    expect(result.current.bookingItem).toEqual({
      title: "Villa Azul",
      price: "€120",
    });
  });

  it("closes and clears the booking item", () => {
    const { result } = renderHook(() => useBookingModal());

    act(() => {
      result.current.openBookingModal("car", { title: "Audi A1" });
      result.current.closeBookingModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.bookingItem).toBeNull();
  });
});

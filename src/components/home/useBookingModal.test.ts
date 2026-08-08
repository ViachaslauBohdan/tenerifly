import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useBookingModal } from "@/components/home/useBookingModal";

describe("useBookingModal", () => {
  it("opens with the selected booking item", () => {
    const { result } = renderHook(() => useBookingModal());

    act(() => {
      result.current.openBookingModal("accommodation", {
        title: "Villa Azul",
        price: "€120",
      });
    });

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

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const replace = vi.fn();
const searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
  usePathname: () => "/ua",
  useSearchParams: () => searchParams,
}));

import { useHeroSearch } from "@/hooks/useHeroSearch";

describe("useHeroSearch", () => {
  beforeEach(() => {
    push.mockReset();
    replace.mockReset();
    searchParams.delete("tab");
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it("keeps checkout aligned when check-in moves past it", () => {
    const { result } = renderHook(() =>
      useHeroSearch({ createLocaleLink: (path) => `/ua${path}` })
    );

    act(() => {
      result.current.handleCheckInChange("2026-08-10");
    });
    act(() => {
      result.current.handleCheckOutChange("2026-08-08");
    });

    expect(result.current.dates).toEqual(["2026-08-10", "2026-08-10"]);
  });

  it("navigates to apartments with guests for accommodation search", () => {
    const { result } = renderHook(() =>
      useHeroSearch({ createLocaleLink: (path) => `/ua${path}` })
    );

    act(() => {
      result.current.setGuests(4);
    });
    act(() => {
      result.current.handleSearch();
    });

    expect(push).toHaveBeenCalledTimes(1);
    const href = String(push.mock.calls[0][0]);
    expect(href.startsWith("/ua/apartments?")).toBe(true);
    expect(href).toContain("guests=4");
    expect(href).toContain("district=Tenerife");
  });

  it("navigates to tours with people and language", () => {
    const { result } = renderHook(() =>
      useHeroSearch({ createLocaleLink: (path) => `/ua${path}` })
    );

    act(() => {
      result.current.onHeroTabChange("tours");
    });
    act(() => {
      result.current.setGuests(6);
      result.current.setTourLanguage("de");
    });
    act(() => {
      result.current.handleSearch();
    });

    expect(push).toHaveBeenCalled();
    const href = String(push.mock.calls.at(-1)?.[0]);
    expect(href.startsWith("/ua/tours?")).toBe(true);
    expect(href).toContain("people=6");
    expect(href).toContain("language=de");
  });
});

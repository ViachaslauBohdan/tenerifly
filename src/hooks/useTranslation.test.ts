import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/pl",
}));

import { useTranslation } from "./useTranslation";

describe("useTranslation locale from URL", () => {
  it("uses the path locale immediately so SSR is not forced to English", () => {
    const { result } = renderHook(() => useTranslation());

    expect(result.current.locale).toBe("pl");
    expect(result.current.createLocaleLink("/cars")).toBe("/pl/cars");
    expect(result.current.createLocaleLink("/tours")).toBe("/pl/tours");
    expect(result.current.createLocaleLink("/#transfers")).toBe(
      "/pl/#transfers"
    );
    expect(result.current.createLocaleLink("/#excursions")).toBe(
      "/pl/#excursions"
    );
  });

  it("rewrites the locale segment when switching language", () => {
    push.mockClear();
    const { result } = renderHook(() => useTranslation());
    result.current.switchLocale("es");
    expect(push).toHaveBeenCalledWith("/es");
  });
});

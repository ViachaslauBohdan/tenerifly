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
    expect(result.current.createLocaleLink("/#transfers")).toBe(
      "/pl/#transfers"
    );
  });
});

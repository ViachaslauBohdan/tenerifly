import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OtpuskTourSearchSection } from "./OtpuskTourSearchSection";

const useOtpuskSearch = vi.fn();

vi.mock("@/hooks/useOtpuskSearch", () => ({
  useOtpuskSearch: (...args: unknown[]) => useOtpuskSearch(...args),
}));

afterEach(() => {
  cleanup();
  useOtpuskSearch.mockReset();
});

describe("OtpuskTourSearchSection", () => {
  it("keeps new_os on the host so Otpusk CSS can attach", () => {
    render(<OtpuskTourSearchSection language="en" />);

    const host = document.getElementById("otpusk-search-container");
    expect(host).toBeTruthy();
    expect(host?.classList.contains("new_os")).toBe(true);
    expect(host?.classList.contains("otpusk-search-host")).toBe(true);
    expect(document.getElementById("otpusk-tour-container")).toBeTruthy();
  });

  it("uses dedicated world-tours container ids", () => {
    render(
      <OtpuskTourSearchSection
        language="en"
        searchContainerId="otpusk-world-search-container"
        tourContainerId="otpusk-world-tour-container"
      />
    );

    expect(
      document.getElementById("otpusk-world-search-container")
    ).toBeTruthy();
    expect(document.getElementById("otpusk-world-tour-container")).toBeTruthy();
    expect(useOtpuskSearch).toHaveBeenCalledWith({
      language: "en",
      searchContainer: "#otpusk-world-search-container",
      tourContainer: "#otpusk-world-tour-container",
    });
  });
});

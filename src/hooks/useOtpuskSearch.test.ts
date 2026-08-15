import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  OTPUSK_MOBILE_FORM_CLASS,
  OTPUSK_NARROW_VIEWPORT,
} from "@/lib/otpuskMobileForm";
import { useOtpuskSearch } from "./useOtpuskSearch";

const originalAppendChild = HTMLElement.prototype.appendChild;

function stubMatchMedia(narrow: boolean) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: query === OTPUSK_NARROW_VIEWPORT ? narrow : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  })) as unknown as typeof window.matchMedia;
}

function installAssetAutoLoad(onOnsite?: () => void) {
  HTMLElement.prototype.appendChild = function (this: HTMLElement, node: Node) {
    const result = originalAppendChild.call(this, node);
    if (node instanceof HTMLScriptElement) {
      if (node.src.includes("js/onsite")) {
        onOnsite?.();
      }
      queueMicrotask(() => node.dispatchEvent(new Event("load")));
    }
    if (node instanceof HTMLLinkElement) {
      queueMicrotask(() => node.dispatchEvent(new Event("load")));
    }
    return result;
  } as typeof originalAppendChild;
}

function installFailingScripts() {
  HTMLElement.prototype.appendChild = function (this: HTMLElement, node: Node) {
    const result = originalAppendChild.call(this, node);
    if (node instanceof HTMLScriptElement) {
      queueMicrotask(() => node.dispatchEvent(new Event("error")));
    }
    if (node instanceof HTMLLinkElement) {
      queueMicrotask(() => node.dispatchEvent(new Event("load")));
    }
    return result;
  } as typeof originalAppendChild;
}

function mountHosts() {
  const search = document.createElement("div");
  search.id = "otpusk-world-search-container";
  search.className = "new_os otpusk-search-host";
  const tours = document.createElement("div");
  tours.id = "otpusk-world-tour-container";
  document.body.append(search, tours);
  return { search, tours };
}

afterEach(() => {
  cleanup();
  HTMLElement.prototype.appendChild = originalAppendChild;
  document.body.replaceChildren();
  document.head.replaceChildren();
  document.body.className = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("useOtpuskSearch", () => {
  it("adds the Otpusk phone class before scripts finish on a narrow viewport", async () => {
    stubMatchMedia(true);
    const { search } = mountHosts();
    installAssetAutoLoad(() => {
      search.innerHTML = `<div class="new_f-form"><div class="clearfix"></div></div>`;
    });

    const { result } = renderHook(() =>
      useOtpuskSearch({
        language: "en",
        searchContainer: "#otpusk-world-search-container",
        tourContainer: "#otpusk-world-tour-container",
      })
    );

    expect(document.body.classList.contains(OTPUSK_MOBILE_FORM_CLASS)).toBe(
      true
    );
    expect(search.classList.contains(OTPUSK_MOBILE_FORM_CLASS)).toBe(true);

    await waitFor(() => {
      expect(result.current).toBe("ready");
    });

    expect(document.body.classList.contains(OTPUSK_MOBILE_FORM_CLASS)).toBe(
      true
    );
    expect(search.classList.contains(OTPUSK_MOBILE_FORM_CLASS)).toBe(true);
  });

  it("does not force the phone class on a wide viewport", async () => {
    stubMatchMedia(false);
    const { search } = mountHosts();
    installAssetAutoLoad(() => {
      search.innerHTML = `<div class="new_f-form"></div>`;
    });

    const { result } = renderHook(() =>
      useOtpuskSearch({
        language: "en",
        searchContainer: "#otpusk-world-search-container",
        tourContainer: "#otpusk-world-tour-container",
      })
    );

    await waitFor(() => {
      expect(result.current).toBe("ready");
    });

    expect(document.body.classList.contains(OTPUSK_MOBILE_FORM_CLASS)).toBe(
      false
    );
    expect(search.classList.contains(OTPUSK_MOBILE_FORM_CLASS)).toBe(false);
  });

  it("maps Ukrainian to Otpusk ua and unsupported locales to en", async () => {
    stubMatchMedia(false);
    const { search } = mountHosts();
    installAssetAutoLoad(() => {
      search.innerHTML = `<div class="new_f-form"></div>`;
    });

    const { rerender, result } = renderHook(
      ({ language }: { language: "ua" | "de" }) =>
        useOtpuskSearch({
          language,
          searchContainer: "#otpusk-world-search-container",
          tourContainer: "#otpusk-world-tour-container",
        }),
      { initialProps: { language: "ua" as const } }
    );

    await waitFor(() => {
      expect(result.current).toBe("ready");
    });
    expect(window.osLang).toBe("ua");
    expect(window.osContainer).toBe("#otpusk-world-search-container");

    await act(async () => {
      rerender({ language: "de" });
    });
    await waitFor(() => {
      expect(window.osLang).toBe("en");
    });
  });

  it("keeps the phone class even when Otpusk scripts fail", async () => {
    stubMatchMedia(true);
    const { search } = mountHosts();
    installFailingScripts();

    const { result } = renderHook(() =>
      useOtpuskSearch({
        language: "en",
        searchContainer: "#otpusk-world-search-container",
        tourContainer: "#otpusk-world-tour-container",
      })
    );

    expect(document.body.classList.contains(OTPUSK_MOBILE_FORM_CLASS)).toBe(
      true
    );
    expect(search.classList.contains(OTPUSK_MOBILE_FORM_CLASS)).toBe(true);

    await waitFor(() => {
      expect(result.current).toBe("error");
    });
  });
});

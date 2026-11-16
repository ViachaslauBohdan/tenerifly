import { afterEach, describe, expect, it } from "vitest";
import {
  appendMissingUtm,
  captureUtm,
  normalizeUtm,
  parseUtmSearch,
  syncUtmInAddressBar,
} from "./utm";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

afterEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe("utm params", () => {
  it("reads only the five campaign tags and drops empty values", () => {
    expect(
      parseUtmSearch(
        "?utm_source=google&utm_medium=cpc&utm_campaign=spring&utm_term=tenerife&utm_content=banner&page=2&ref=no"
      )
    ).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "spring",
      utm_term: "tenerife",
      utm_content: "banner",
    });
    expect(normalizeUtm({ utm_source: "  ", utm_medium: 12, other: "x" })).toEqual({});
  });

  it("keeps a saved campaign when the next page has no tags", () => {
    const session = memoryStorage();
    const local = memoryStorage();

    expect(
      captureUtm("?utm_source=instagram&utm_medium=cpc", [session, local])
    ).toEqual({
      utm_source: "instagram",
      utm_medium: "cpc",
    });
    expect(captureUtm("?page=3", [session, local])).toEqual({
      utm_source: "instagram",
      utm_medium: "cpc",
    });
  });

  it("replaces the saved campaign when a new landing URL brings its own tags", () => {
    const storage = memoryStorage();
    captureUtm("?utm_source=google&utm_campaign=old", [storage]);

    expect(captureUtm("?utm_source=facebook&utm_campaign=new", [storage])).toEqual({
      utm_source: "facebook",
      utm_campaign: "new",
    });
    expect(captureUtm("", [storage])).toEqual({
      utm_source: "facebook",
      utm_campaign: "new",
    });
  });

  it("adds saved tags to the address without rewriting the existing query", () => {
    expect(
      appendMissingUtm("?page=2&tab=stays", {
        utm_source: "google",
        utm_content: "a b",
      })
    ).toBe("?page=2&tab=stays&utm_source=google&utm_content=a%20b");
    expect(appendMissingUtm("?utm_source=google", { utm_source: "google" })).toBe(
      "?utm_source=google"
    );
  });

  it("writes the campaign into the address bar and both storages", () => {
    window.history.replaceState({}, "", "/ru/apartments?utm_source=tiktok&utm_medium=paid");

    syncUtmInAddressBar({
      pathname: "/ru/apartments",
      search: window.location.search,
      history: window.history,
      storages: [window.sessionStorage, window.localStorage],
    });

    expect(window.localStorage.getItem("tenerifejoy_utm")).toContain("tiktok");
    expect(window.sessionStorage.getItem("tenerifejoy_utm")).toContain("tiktok");

    window.history.replaceState({}, "", "/ru/tours");
    syncUtmInAddressBar({
      pathname: "/ru/tours",
      search: "",
      history: window.history,
      storages: [window.sessionStorage, window.localStorage],
    });

    expect(window.location.pathname).toBe("/ru/tours");
    expect(window.location.search).toBe("?utm_source=tiktok&utm_medium=paid");
  });
});

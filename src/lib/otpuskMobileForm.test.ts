import { afterEach, describe, expect, it, vi } from "vitest";
import {
  OTPUSK_LEGACY_MOBILE_FORM_CLASS,
  OTPUSK_MOBILE_FORM_CLASS,
  OTPUSK_NARROW_VIEWPORT,
  getOtpuskRoot,
  hasOtpuskMobileFormClass,
  isOtpuskLayoutSettled,
  isOtpuskNarrowViewport,
  syncOtpuskMobileFormClass,
  toOtpuskLang,
  waitForOtpuskLayout,
} from "./otpuskMobileForm";

function fakeTarget(classes: string[] = []) {
  const set = new Set(classes);
  return {
    classList: {
      add: (cls: string) => {
        set.add(cls);
      },
      remove: (cls: string) => {
        set.delete(cls);
      },
      contains: (cls: string) => set.has(cls),
    } as unknown as DOMTokenList,
    has: (cls: string) => set.has(cls),
  };
}

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

function mountSearchHost(html = "") {
  const host = document.createElement("div");
  host.id = "otpusk-world-search-container";
  host.className = "new_os otpusk-search-host";
  host.innerHTML = html;
  document.body.appendChild(host);
  return host;
}

afterEach(() => {
  document.body.replaceChildren();
  document.body.className = "";
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("toOtpuskLang", () => {
  it("keeps Otpusk-supported languages", () => {
    expect(toOtpuskLang("en")).toBe("en");
    expect(toOtpuskLang("ru")).toBe("ru");
    expect(toOtpuskLang("pl")).toBe("pl");
    expect(toOtpuskLang("ua")).toBe("ua");
  });

  it("falls back to English for languages Otpusk does not ship", () => {
    expect(toOtpuskLang("de")).toBe("en");
    expect(toOtpuskLang("es")).toBe("en");
    expect(toOtpuskLang("fr")).toBe("en");
  });
});

describe("isOtpuskNarrowViewport", () => {
  it("reads the 639px phone breakpoint", () => {
    expect(
      isOtpuskNarrowViewport(() => ({ matches: true }))
    ).toBe(true);
    expect(
      isOtpuskNarrowViewport(() => ({ matches: false }))
    ).toBe(false);
  });
});

describe("syncOtpuskMobileFormClass", () => {
  it("adds Otpusk phone class on a narrow viewport", () => {
    const target = fakeTarget();
    syncOtpuskMobileFormClass(target, true);
    expect(target.has(OTPUSK_MOBILE_FORM_CLASS)).toBe(true);
  });

  it("removes Otpusk phone class on a wide viewport", () => {
    const target = fakeTarget([OTPUSK_MOBILE_FORM_CLASS]);
    syncOtpuskMobileFormClass(target, false);
    expect(target.has(OTPUSK_MOBILE_FORM_CLASS)).toBe(false);
  });

  it("is idempotent when the phone class is already present", () => {
    const host = document.createElement("div");
    host.classList.add(OTPUSK_MOBILE_FORM_CLASS);
    syncOtpuskMobileFormClass(host, true);
    expect([...host.classList]).toEqual([OTPUSK_MOBILE_FORM_CLASS]);
  });

  it("uses window.matchMedia when the caller does not pass a flag", () => {
    stubMatchMedia(true);
    const host = document.createElement("div");
    syncOtpuskMobileFormClass(host);
    expect(host.classList.contains(OTPUSK_MOBILE_FORM_CLASS)).toBe(true);
  });
});

describe("hasOtpuskMobileFormClass", () => {
  it("accepts both current and legacy Otpusk phone classes", () => {
    const current = fakeTarget([OTPUSK_MOBILE_FORM_CLASS]);
    const legacy = fakeTarget([OTPUSK_LEGACY_MOBILE_FORM_CLASS]);
    expect(hasOtpuskMobileFormClass(current)).toBe(true);
    expect(hasOtpuskMobileFormClass(legacy)).toBe(true);
    expect(hasOtpuskMobileFormClass(fakeTarget())).toBe(false);
  });
});

describe("getOtpuskRoot", () => {
  it("uses the host when it already has new_os", () => {
    const host = mountSearchHost();
    expect(getOtpuskRoot(host)).toBe(host);
  });

  it("finds a nested new_os root", () => {
    const host = document.createElement("div");
    host.innerHTML = `<div class="new_os"><div class="new_f-form"></div></div>`;
    expect(getOtpuskRoot(host)?.classList.contains("new_os")).toBe(true);
  });
});

describe("isOtpuskLayoutSettled", () => {
  it("is not settled until the Otpusk form exists", () => {
    stubMatchMedia(true);
    const host = mountSearchHost();
    document.body.classList.add(OTPUSK_MOBILE_FORM_CLASS);
    expect(isOtpuskLayoutSettled(host)).toBe(false);
  });

  it("is settled on a wide viewport as soon as the form exists", () => {
    stubMatchMedia(false);
    const host = mountSearchHost(`<div class="new_f-form"></div>`);
    expect(isOtpuskLayoutSettled(host)).toBe(true);
  });

  it("stays unsettled on a phone until the mobile class is present", () => {
    stubMatchMedia(true);
    const host = mountSearchHost(`<div class="new_f-form"></div>`);
    expect(isOtpuskLayoutSettled(host)).toBe(false);

    document.body.classList.add(OTPUSK_MOBILE_FORM_CLASS);
    expect(isOtpuskLayoutSettled(host)).toBe(true);
  });

  it("accepts the phone class on the Otpusk root instead of body", () => {
    stubMatchMedia(true);
    const host = mountSearchHost(`<div class="new_f-form"></div>`);
    host.classList.add(OTPUSK_MOBILE_FORM_CLASS);
    expect(isOtpuskLayoutSettled(host)).toBe(true);
  });
});

describe("waitForOtpuskLayout", () => {
  it("resolves immediately when the container is missing", async () => {
    await expect(waitForOtpuskLayout("#missing", 20)).resolves.toBeUndefined();
  });

  it("resolves immediately when the desktop form is already present", async () => {
    stubMatchMedia(false);
    mountSearchHost(`<div class="new_f-form"></div>`);
    await expect(
      waitForOtpuskLayout("#otpusk-world-search-container", 20)
    ).resolves.toBeUndefined();
  });

  it("resolves after Otpusk injects the form on a phone with the mobile class", async () => {
    stubMatchMedia(true);
    const host = mountSearchHost();
    document.body.classList.add(OTPUSK_MOBILE_FORM_CLASS);

    const started = Date.now();
    const pending = waitForOtpuskLayout("#otpusk-world-search-container", 500);
    host.innerHTML = `<div class="new_f-form"></div>`;
    await expect(pending).resolves.toBeUndefined();
    expect(Date.now() - started).toBeLessThan(400);
  });

  it("times out instead of hanging when the form never appears", async () => {
    stubMatchMedia(true);
    mountSearchHost();
    await expect(
      waitForOtpuskLayout("#otpusk-world-search-container", 20)
    ).resolves.toBeUndefined();
  });
});

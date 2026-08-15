export const OTPUSK_MOBILE_FORM_CLASS = "new_mobile-form";
export const OTPUSK_LEGACY_MOBILE_FORM_CLASS = "new_m-mobile-form";
export const OTPUSK_NARROW_VIEWPORT = "(max-width: 639px)";
export const OTPUSK_LAYOUT_WAIT_MS = 8000;

export type OtpuskLanguage = "en" | "ru" | "pl" | "fr" | "ua" | "de" | "es";

export function toOtpuskLang(language: OtpuskLanguage): string {
  if (language === "ua") return "ua";
  if (language === "en" || language === "ru" || language === "pl") {
    return language;
  }
  return "en";
}

export function isOtpuskNarrowViewport(
  matchMedia: (query: string) => { matches: boolean } = (query) =>
    window.matchMedia(query)
): boolean {
  return matchMedia(OTPUSK_NARROW_VIEWPORT).matches;
}

export function hasOtpuskMobileFormClass(target: {
  classList: DOMTokenList;
}): boolean {
  return (
    target.classList.contains(OTPUSK_MOBILE_FORM_CLASS) ||
    target.classList.contains(OTPUSK_LEGACY_MOBILE_FORM_CLASS)
  );
}

/**
 * Otpusk desktop CSS locks the search row at 890px. On phones the widget
 * often never adds `new_mobile-form`, so fields stay in one overflowing row.
 * Force the vendor phone class so their stacked layout CSS applies.
 */
export function syncOtpuskMobileFormClass(
  target: { classList: DOMTokenList },
  isNarrow: boolean = isOtpuskNarrowViewport()
): void {
  if (isNarrow) {
    target.classList.add(OTPUSK_MOBILE_FORM_CLASS);
    return;
  }
  target.classList.remove(OTPUSK_MOBILE_FORM_CLASS);
}

export function getOtpuskRoot(container: Element): Element | null {
  if (container.classList.contains("new_os")) {
    return container;
  }
  return container.querySelector(".new_os");
}

export function isOtpuskLayoutSettled(container: Element): boolean {
  if (!container.querySelector(".new_f-form")) {
    return false;
  }

  if (!isOtpuskNarrowViewport()) {
    return true;
  }

  const root = getOtpuskRoot(container);
  return (
    hasOtpuskMobileFormClass(document.body) ||
    (root != null && hasOtpuskMobileFormClass(root))
  );
}

export function waitForOtpuskLayout(
  selector: string,
  timeoutMs = OTPUSK_LAYOUT_WAIT_MS
): Promise<void> {
  return new Promise((resolve) => {
    const container = document.querySelector(selector);
    if (!container) {
      resolve();
      return;
    }

    let finished = false;
    let timer = 0;
    const finish = () => {
      if (finished) return;
      finished = true;
      observer.disconnect();
      window.clearTimeout(timer);
      resolve();
    };

    const observer = new MutationObserver(() => {
      if (isOtpuskLayoutSettled(container)) {
        finish();
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    if (isOtpuskLayoutSettled(container)) {
      finish();
      return;
    }

    timer = window.setTimeout(finish, timeoutMs);
  });
}

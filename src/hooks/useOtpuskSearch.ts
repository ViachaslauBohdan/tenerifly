"use client";

import { useEffect, useState } from "react";
import "@/types/otpusk-window";

type OtpuskLanguage = "en" | "ru" | "pl" | "fr" | "ua" | "de" | "es";

export type OtpuskSearchStatus = "loading" | "ready" | "error";

const OTPUSK_FORM_CSS = "https://export.otpusk.com/os/onsite/form.css";

function toOtpuskLang(language: OtpuskLanguage): string {
  if (language === "ua") return "ua";
  if (language === "en" || language === "ru" || language === "pl") {
    return language;
  }
  return "en";
}

export type UseOtpuskSearchOptions = {
  language: OtpuskLanguage;
  searchContainer: string;
  tourContainer: string;
};

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.src = src;
    script.id = id;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function ensureOtpuskFormCss(): Promise<void> {
  const existing = document.querySelector(
    `link[rel="stylesheet"][href="${OTPUSK_FORM_CSS}"]`
  ) as HTMLLinkElement | null;

  if (existing?.sheet) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const link = existing ?? document.createElement("link");
    if (!existing) {
      link.rel = "stylesheet";
      link.href = OTPUSK_FORM_CSS;
      document.head.appendChild(link);
    }

    const done = () => resolve();
    link.addEventListener("load", done, { once: true });
    link.addEventListener("error", done, { once: true });
    window.setTimeout(done, 4000);
  });
}

function getOtpuskRoot(container: Element): Element | null {
  if (container.classList.contains("new_os")) {
    return container;
  }
  return container.querySelector(".new_os");
}

function isOtpuskLayoutSettled(container: Element): boolean {
  if (!container.querySelector(".new_f-form")) {
    return false;
  }

  if (!window.matchMedia("(max-width: 639px)").matches) {
    return true;
  }

  const root = getOtpuskRoot(container);
  if (!root) {
    return false;
  }

  return (
    root.classList.contains("new_m-mobile-form") ||
    root.classList.contains("new_mobile-form")
  );
}

function waitForOtpuskLayout(
  selector: string,
  timeoutMs = 8000
): Promise<void> {
  return new Promise((resolve) => {
    const container = document.querySelector(selector);
    if (!container) {
      resolve();
      return;
    }

    let finished = false;
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

    const timer = window.setTimeout(finish, timeoutMs);
  });
}

export function useOtpuskSearch({
  language,
  searchContainer,
  tourContainer,
}: UseOtpuskSearchOptions): OtpuskSearchStatus {
  const [status, setStatus] = useState<OtpuskSearchStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    setStatus("loading");

    window.osGeo = "";
    window.osDefaultDeparture = "";
    window.osDefaultDuration = "";
    window.osDateFrom = "";
    window.osDateTo = "";
    window.osHotelCategory = "";
    window.osFood = "";
    window.osTransport = "";
    window.osTarget = "";
    window.osContainer = searchContainer;
    window.osTourContainer = tourContainer;
    window.osLang = toOtpuskLang(language);
    window.osTourTargetBlank = false;
    window.osOrderUrl = null;
    window.osCurrency = "converted";
    window.osAutoStart = false;

    const searchCont = document.querySelector(searchContainer);
    const tourCont = document.querySelector(tourContainer);
    if (searchCont) searchCont.innerHTML = "";
    if (tourCont) tourCont.innerHTML = "";

    const scriptSuffix = searchContainer.replace(/[^a-z0-9]/gi, "-");
    const ts = Date.now();

    const init = async () => {
      try {
        await ensureOtpuskFormCss();
        if (cancelled) return;

        await loadScript(
          `https://api.otpusk.com/api/2.4/session?access_token=3f93a-35d0c-a0b24-5a708-493e5&ts=${ts}`,
          `otpusk-script-session-${scriptSuffix}`
        );
        if (cancelled) return;

        await loadScript(
          `https://export.otpusk.com/js/onsite/?ts=${ts}`,
          `otpusk-script-onsite-${scriptSuffix}`
        );
        if (cancelled) return;

        await waitForOtpuskLayout(searchContainer);
        if (cancelled) return;

        setStatus("ready");

        void loadScript(
          `https://export.otpusk.com/js/order?ts=${ts}`,
          `otpusk-script-order-${scriptSuffix}`
        );
      } catch (error) {
        console.error("Otpusk search failed to load", error);
        if (!cancelled) {
          setStatus("error");
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [language, searchContainer, tourContainer]);

  return status;
}

"use client";

import { useEffect } from "react";
import "@/types/otpusk-window";

type OtpuskLanguage = "en" | "ru" | "pl" | "fr" | "ua" | "de" | "es";

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

export function useOtpuskSearch({
  language,
  searchContainer,
  tourContainer,
}: UseOtpuskSearchOptions) {
  useEffect(() => {
    let cancelled = false;

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

        void loadScript(
          `https://export.otpusk.com/js/order?ts=${ts}`,
          `otpusk-script-order-${scriptSuffix}`
        );
      } catch (error) {
        console.error("Otpusk search failed to load", error);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [language, searchContainer, tourContainer]);
}

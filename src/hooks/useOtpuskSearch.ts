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

export function useOtpuskSearch({
  language,
  searchContainer,
  tourContainer,
}: UseOtpuskSearchOptions) {
  useEffect(() => {
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

    const loadScript = (src: string, id: string) => {
      const oldScript = document.getElementById(id);
      if (oldScript) oldScript.remove();

      const script = document.createElement("script");
      script.src = src;
      script.id = id;
      script.async = true;
      document.body.appendChild(script);
    };

    const scriptSuffix = searchContainer.replace(/[^a-z0-9]/gi, "-");
    const ts = new Date().getTime();
    loadScript(
      `https://api.otpusk.com/api/2.4/session?access_token=3f93a-35d0c-a0b24-5a708-493e5&ts=${ts}`,
      `otpusk-script-session-${scriptSuffix}`
    );
    loadScript(
      `https://export.otpusk.com/js/onsite/?ts=${ts}`,
      `otpusk-script-onsite-${scriptSuffix}`
    );
    loadScript(
      `https://export.otpusk.com/js/order?ts=${ts}`,
      `otpusk-script-order-${scriptSuffix}`
    );

    return () => {
      [
        `otpusk-script-session-${scriptSuffix}`,
        `otpusk-script-onsite-${scriptSuffix}`,
        `otpusk-script-order-${scriptSuffix}`,
      ].forEach((id) => {
        const s = document.getElementById(id);
        if (s) s.remove();
      });
    };
  }, [language, searchContainer, tourContainer]);
}

"use client";

import dynamic from "next/dynamic";

const loadSimpleBookingPopup = () =>
  import("@/components/SimpleBookingPopup").then(
    (mod) => mod.SimpleBookingPopup
  );

/** Lazy booking modal — keeps phone/flags/libphonenumber out of the initial client chunk. */
export const DeferredSimpleBookingPopup = dynamic(loadSimpleBookingPopup, {
  ssr: false,
});

/** Warm the booking-modal chunk so open is instant after idle. */
export function preloadSimpleBookingPopup() {
  void loadSimpleBookingPopup();
  const preloadable = DeferredSimpleBookingPopup as typeof DeferredSimpleBookingPopup & {
    preload?: () => void;
  };
  preloadable.preload?.();
}

function scheduleBookingPopupPreload() {
  if (typeof window === "undefined") return;

  const run = () => {
    preloadSimpleBookingPopup();
  };

  const requestIdleCallback = window.requestIdleCallback;
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(run, { timeout: 2000 });
    return;
  }

  globalThis.setTimeout(run, 200);
}

scheduleBookingPopupPreload();

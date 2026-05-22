"use client";

import dynamic from "next/dynamic";

export const DeferredReferral = dynamic(
  () =>
    import("@/components/ReferralCodeClient").then((mod) => mod.ReferralCodeClient),
  { ssr: false }
);

export const DeferredWhatsApp = dynamic(
  () =>
    import("@/components/WhatsAppFloatingButton").then(
      (mod) => mod.WhatsAppFloatingButton
    ),
  { ssr: false }
);

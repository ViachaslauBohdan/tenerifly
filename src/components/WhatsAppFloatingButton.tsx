"use client";

import { usePathname } from "next/navigation";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { SITE_WHATSAPP_DIGITS, whatsappHref } from "@/lib/siteContact";

/** World-tours page contact. */
const WORLD_TOURS_WHATSAPP_NUMBER = "380959390292";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const href = pathname?.includes("/world-tours")
    ? whatsappHref(WORLD_TOURS_WHATSAPP_NUMBER)
    : whatsappHref(SITE_WHATSAPP_DIGITS);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed z-[1000] flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-[transform,box-shadow] hover:scale-105 hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] max-sm:bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] max-sm:right-3 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
    >
      <IconBrandWhatsapp className="h-7 w-7 sm:h-8 sm:w-8" stroke={2} />
    </a>
  );
}

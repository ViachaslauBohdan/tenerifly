"use client";

import { useRouter, usePathname } from "next/navigation";
import { Locale, LOCALES } from "@/types/locale";
import { useState, useEffect } from "react";
import mainTranslations from "@/i18n/main.json";

export function useTranslation() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathSegments = pathname.split("/");
  const localeFromPath = pathSegments[1] as Locale;
  const currentLocale: Locale =
    LOCALES.find((l) => l.code === localeFromPath)?.code || "en";

  const t = mainTranslations[currentLocale] || mainTranslations.en;

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");

    if (LOCALES.find((l) => l.code === segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    const newPath = segments.join("/");
    router.push(newPath);
  };

  if (!mounted) {
    return {
      t: mainTranslations.en,
      locale: "en" as Locale,
      locales: LOCALES,
      switchLocale: () => {},
    };
  }

  return {
    t,
    locale: currentLocale,
    locales: LOCALES,
    switchLocale,
  };
}

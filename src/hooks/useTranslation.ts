"use client";

import { useRouter, usePathname } from "next/navigation";
import { Locale, LOCALES, localeContentKey } from "@/types/locale";
import mainTranslations from "@/i18n/main.json";

export function useTranslation() {
  const router = useRouter();
  const pathname = usePathname();

  const pathSegments = pathname.split("/");
  const localeFromPath = pathSegments[1] as Locale;
  const currentLocale: Locale =
    LOCALES.find((l) => l.code === localeFromPath)?.code || "en";

  const contentKey = localeContentKey(
    currentLocale
  ) as keyof typeof mainTranslations;
  const t = mainTranslations[contentKey] || mainTranslations.en;

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

  const createLocaleLink = (path: string): string => {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    if (LOCALES.find((l) => l.code === cleanPath.split("/")[0])) {
      return `/${cleanPath}`;
    }

    return `/${currentLocale}/${cleanPath}`;
  };

  return {
    t,
    locale: currentLocale,
    locales: LOCALES,
    switchLocale,
    createLocaleLink,
  };
}

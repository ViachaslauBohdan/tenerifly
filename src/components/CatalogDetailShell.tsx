"use client";

import { useEffect, useState } from "react";
import { SiteHeader, type SiteHeaderLanguage } from "@/components/SiteHeader";
import { useTranslation } from "@/hooks/useTranslation";

type CatalogDetailShellProps = {
  children: React.ReactNode;
};

export function CatalogDetailShell({ children }: CatalogDetailShellProps) {
  const { locale, switchLocale, createLocaleLink, t } = useTranslation();
  const [language, setLanguage] = useState<SiteHeaderLanguage>(
    locale as SiteHeaderLanguage
  );

  useEffect(() => {
    setLanguage(locale as SiteHeaderLanguage);
  }, [locale]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader
        language={language}
        onLanguageChange={switchLocale}
        selectLanguageLabel={t.selectLanguage}
        excursionsLabel={t.hero.tabs.excursions}
        variant="standalone"
        createLocaleLink={createLocaleLink}
      />
      <div className="pt-[6.25rem] min-[400px]:pt-[6.5rem] sm:pt-[6.25rem] md:pt-16">
        <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
      </div>
    </div>
  );
}

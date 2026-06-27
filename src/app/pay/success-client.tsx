"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Stack, Text, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  SiteHeader,
  type SiteHeaderLanguage,
} from "@/components/SiteHeader";
import payJson from "@/i18n/pay.json";
import { pickLocaleBundle } from "@/types/locale";

type PayBundle = (typeof payJson)["en"];

export default function PaySuccessPageClient() {
  const { locale, switchLocale, createLocaleLink, t } = useTranslation();
  const pay = pickLocaleBundle(payJson as Record<string, PayBundle>, locale);

  const [language, setLanguage] = useState<SiteHeaderLanguage>(
    locale as SiteHeaderLanguage
  );

  useEffect(() => {
    setLanguage(locale as SiteHeaderLanguage);
  }, [locale]);

  return (
    <main className="min-h-screen bg-gray-50">
      <SiteHeader
        language={language}
        onLanguageChange={switchLocale}
        selectLanguageLabel={t.selectLanguage}
        tabLabels={{
          accommodation: t.hero.tabs.accommodation,
          cars: t.hero.tabs.cars,
          excursions: t.hero.tabs.excursions,
          blog: t.hero.tabs.blog,
        }}
        variant="standalone"
        activePage="pay"
        payByCardLabel={pay.navLabel}
        createLocaleLink={createLocaleLink}
      />

      <div className="pt-[6.25rem] min-[400px]:pt-[6.5rem] sm:pt-[6.25rem] md:pt-16">
        <div className="mx-auto max-w-lg px-4 py-12 text-center min-[400px]:px-5 sm:px-6">
          <Stack gap="lg" align="center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <IconCheck size={32} />
            </div>
            <Title order={1} className="text-2xl font-bold text-gray-900">
              {pay.successTitle}
            </Title>
            <Text className="text-gray-600">{pay.successMessage}</Text>
            <Button
              component={Link}
              href={createLocaleLink("/")}
              size="md"
              variant="light"
            >
              {pay.successBack}
            </Button>
          </Stack>
        </div>
      </div>
    </main>
  );
}

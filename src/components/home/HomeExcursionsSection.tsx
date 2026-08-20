"use client";

import { useEffect, useState } from "react";
import { AtlanticoExcursionCard } from "@/components/AtlanticoExcursionCard";
import { AtlanticoCategoriesHeading } from "@/components/atlantico/AtlanticoCategoriesHeading";
import { AtlanticoCategoryCard } from "@/components/atlantico/AtlanticoCategoryCard";
import { ViewAllLink } from "@/components/ViewAllLink";
import { useTranslation } from "@/hooks/useTranslation";
import type { AtlanticoClassification } from "@/lib/atlantico/types";
import type { LanguageCode } from "@/components/home/types";
import translationsJson from "@/i18n/main.json";

type ExcursionsCopy = (typeof translationsJson)["en"]["sections"]["excursions"];

type HomeExcursionsSectionProps = {
  language: LanguageCode;
  copy: ExcursionsCopy;
  intermediaryNotice: string;
  toursHref: string;
};

const HOME_CATEGORY_LIMIT = 6;

export function HomeExcursionsSection({
  language,
  copy,
  intermediaryNotice,
  toursHref,
}: HomeExcursionsSectionProps) {
  const { createLocaleLink } = useTranslation();
  const [categories, setCategories] = useState<AtlanticoClassification[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `/api/atlantico/classifications?locale=${encodeURIComponent(language)}`
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          classifications?: AtlanticoClassification[];
        };
        if (!cancelled) {
          setCategories(
            (data.classifications ?? [])
              .filter((item) => (item.count ?? 0) > 0)
              .slice(0, HOME_CATEGORY_LIMIT)
          );
        }
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [language]);

  return (
    <section
      id="excursions"
      className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4">
        {intermediaryNotice ? (
          <p className="mb-6 text-center text-sm text-gray-500">
            {intermediaryNotice}
          </p>
        ) : null}

        <AtlanticoCategoriesHeading locale={language} as="h2" />

        {!ready ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="aspect-[4/3] animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((classification) => (
                <AtlanticoCategoryCard
                  key={classification.id || classification.code}
                  classification={classification}
                  href={`${createLocaleLink("/tours")}?category=${encodeURIComponent(classification.id || classification.code)}`}
                />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <ViewAllLink href={toursHref} className="sm:ml-0">
                {copy.viewAll}
              </ViewAllLink>
            </div>
          </>
        ) : (
          <AtlanticoExcursionCard locale={language} variant="home" />
        )}
      </div>
    </section>
  );
}

"use client";

import { AtlanticoExcursionCard } from "@/components/AtlanticoExcursionCard";
import { ExcursionsIntermediaryNotice } from "@/components/ExcursionsIntermediaryNotice";
import { ViewAllLink } from "@/components/ViewAllLink";
import type { LanguageCode } from "@/components/home/types";
import translationsJson from "@/i18n/main.json";

type ExcursionsCopy = (typeof translationsJson)["en"]["sections"]["excursions"];

type HomeExcursionsSectionProps = {
  language: LanguageCode;
  copy: ExcursionsCopy;
  intermediaryNotice: string;
  toursHref: string;
};

export function HomeExcursionsSection({
  language,
  copy,
  intermediaryNotice,
  toursHref,
}: HomeExcursionsSectionProps) {
  return (
    <section
      id="excursions"
      className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 md:mb-14 gap-4">
          <div className="text-center flex-1 w-full sm:w-auto">
            {intermediaryNotice ? (
              <ExcursionsIntermediaryNotice
                text={intermediaryNotice}
                as="h2"
                variant="section"
                className="mx-auto max-w-3xl sm:mx-0"
              />
            ) : (
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {copy.title}
              </h2>
            )}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto sm:mx-0 sm:max-w-none">
              {copy.subtitle}
            </p>
          </div>
          <ViewAllLink href={toursHref} className="sm:ml-8">
            {copy.viewAll}
          </ViewAllLink>
        </div>

        <AtlanticoExcursionCard locale={language} variant="home" />
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import translationsJson from "@/i18n/main.json";
import { pickLocaleBundle } from "@/types/locale";

type HeroCopy = (typeof translationsJson)["en"]["hero"];

type HomeWorldToursSectionProps = {
  hero: HeroCopy;
  href: string;
};

export function HomeWorldToursSection({
  hero,
  href,
}: HomeWorldToursSectionProps) {
  const enHero = pickLocaleBundle(translationsJson, "en").hero;
  const worldToursBase = hero.worldTours ?? enHero.worldTours;
  const searchGlobalToursLabel =
    hero.searchGlobalTours ?? enHero.searchGlobalTours;
  const labels = {
    ...worldToursBase,
    search: searchGlobalToursLabel ?? worldToursBase.search,
  };

  return (
    <section
      id="worldwide-tours"
      aria-labelledby="worldwide-tours-heading"
      className="scroll-mt-[6.5rem] bg-gray-50 py-20 md:scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2
            id="worldwide-tours-heading"
            className="text-3xl font-bold text-gray-900 md:text-4xl"
          >
            {labels.heading}
          </h2>
          <p className="mt-4 text-base text-gray-600 md:text-lg">
            {labels.hint}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg sm:flex-row sm:items-center sm:gap-4 sm:p-4">
            <div className="flex min-w-0 flex-1 items-center gap-3 px-2 text-left sm:px-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Globe className="h-5 w-5" aria-hidden />
              </span>
              <span className="block min-w-0 text-base font-semibold text-gray-900">
                {labels.title}
              </span>
            </div>
            <Link
              href={href}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg sm:w-auto sm:min-w-40"
            >
              {labels.search}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

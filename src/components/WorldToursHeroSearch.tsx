"use client";

import { Compass, Plane } from "lucide-react";
import { HeroSearchCtaLink } from "@/components/HeroSearchCta";
import {
  heroWorldToursCardClass,
  heroWorldToursCardShellClass,
  heroWorldToursCardTitleClass,
  heroWorldToursSearchCtaClass,
  heroWorldToursSearchFieldsClass,
  heroWorldToursSearchHintClass,
  heroWorldToursSearchWrapClass,
} from "@/lib/heroSearchLayout";

export type WorldToursHeroSearchLabels = {
  heading: string;
  title: string;
  hint: string;
  search: string;
};

type WorldToursHeroSearchProps = {
  href: string;
  labels: WorldToursHeroSearchLabels;
  className?: string;
};

export function WorldToursHeroSearch({
  href,
  labels,
  className = "",
}: WorldToursHeroSearchProps) {
  return (
    <div className={`${heroWorldToursCardShellClass} ${className}`}>
      <Compass
        className="pointer-events-none absolute -left-2 top-1/2 hidden h-24 w-24 -translate-y-1/2 text-white opacity-[0.14] sm:left-2 sm:block sm:h-28 sm:w-28 md:h-20 md:w-20"
        aria-hidden
      />
      <Plane
        className="pointer-events-none absolute -right-2 top-1/2 hidden h-20 w-20 -translate-y-1/2 text-white opacity-[0.14] sm:right-2 sm:block sm:h-24 sm:w-24 md:h-[4.5rem] md:w-[4.5rem]"
        aria-hidden
      />

      <div className={`relative ${heroWorldToursCardClass}`}>
        <h2 className={heroWorldToursCardTitleClass}>{labels.title}</h2>
        <div className={heroWorldToursSearchWrapClass}>
          <div className={heroWorldToursSearchFieldsClass}>
            <p className={heroWorldToursSearchHintClass}>{labels.hint}</p>
          </div>
          <HeroSearchCtaLink
            href={href}
            label={labels.search}
            variant="orange"
            className={heroWorldToursSearchCtaClass}
          />
        </div>
      </div>
    </div>
  );
}

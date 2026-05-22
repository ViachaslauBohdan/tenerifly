"use client";

import { Compass, Plane } from "lucide-react";
import { HeroSearchCtaLink } from "@/components/HeroSearchCta";
import {
  heroSearchFieldsClass,
  heroSearchHintClass,
  heroSearchInsetClass,
  heroSearchWrapClass,
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
    <div
      className={`relative overflow-hidden rounded-xl bg-[#5DADE2] shadow-[0_16px_48px_rgba(15,23,42,0.35)] ${className}`}
    >
      <Compass
        className="pointer-events-none absolute -left-2 top-1/2 h-28 w-28 -translate-y-1/2 text-white opacity-[0.14] sm:left-2 sm:h-36 sm:w-36"
        aria-hidden
      />
      <Plane
        className="pointer-events-none absolute -right-2 top-1/2 h-24 w-24 -translate-y-1/2 text-white opacity-[0.14] sm:right-2 sm:h-32 sm:w-32"
        aria-hidden
      />

      <div className={`relative pt-3 sm:pt-5 ${heroSearchInsetClass}`}>
        <h2 className="mb-2 text-[18px] font-bold leading-tight tracking-tight text-white sm:mb-3">
          {labels.title}
        </h2>
      </div>

      <div className={heroSearchInsetClass}>
        <div className={heroSearchWrapClass}>
          <div className={heroSearchFieldsClass}>
            <p className={heroSearchHintClass}>{labels.hint}</p>
          </div>
          <HeroSearchCtaLink
            href={href}
            label={labels.search}
            variant="orange"
          />
        </div>
      </div>

      <div className="pb-5 sm:pb-8" aria-hidden="true" />
    </div>
  );
}

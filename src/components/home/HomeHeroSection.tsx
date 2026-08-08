"use client";

import { Car, Home, MapPin, type LucideIcon } from "lucide-react";
import { DatesProvider } from "@mantine/dates";
import { WorldToursHeroSearch } from "@/components/WorldToursHeroSearch";
import { HeroSearchCtaButton } from "@/components/HeroSearchCta";
import { HeroCompactDateInput } from "@/components/HeroCompactDateInput";
import { ExcursionsIntermediaryNotice } from "@/components/ExcursionsIntermediaryNotice";
import { CompactSearchField } from "@/components/home/CompactSearchField";
import { CompactGuestSelect } from "@/components/home/CompactGuestSelect";
import { CompactSelect } from "@/components/home/CompactSelect";
import { dayjsLocale } from "@/lib/dateLocale";
import type { HeroTab } from "@/lib/heroTab";
import {
  heroBlockStackClass,
  heroInnerClass,
  heroSearchFieldsClass,
  heroSearchInsetClass,
  heroSearchWrapClass,
  heroSectionClass,
  heroTitleClass,
} from "@/lib/heroSearchLayout";
import type { LanguageCode } from "@/components/home/types";
import translationsJson from "@/i18n/main.json";
import { pickLocaleBundle } from "@/types/locale";

type MainBundle = (typeof translationsJson)["en"];
type HeroCopy = MainBundle["hero"];

const HERO_BG =
  "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";

const compactControlClass =
  "w-full min-w-0 border-0 bg-transparent p-0 text-base font-semibold leading-snug text-gray-900 shadow-none outline-none focus:ring-0 placeholder:font-normal placeholder:text-gray-400";

const HERO_TAB_ICONS: Record<HeroTab, LucideIcon> = {
  accommodation: Home,
  cars: Car,
  tours: MapPin,
};

type HomeHeroSectionProps = {
  language: LanguageCode;
  hero: HeroCopy;
  excursionsIntermediaryNotice: string;
  worldToursHref: string;
  activeTab: HeroTab;
  dates: [string, string];
  guests: number;
  carType: string;
  tourLanguage: string;
  onHeroTabChange: (value: string) => void;
  onGuestsChange: (value: number) => void;
  onCarTypeChange: (value: string) => void;
  onTourLanguageChange: (value: string) => void;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onSearch: () => void;
};

export function HomeHeroSection({
  language,
  hero,
  excursionsIntermediaryNotice,
  worldToursHref,
  activeTab,
  dates,
  guests,
  carType,
  tourLanguage,
  onHeroTabChange,
  onGuestsChange,
  onCarTypeChange,
  onTourLanguageChange,
  onCheckInChange,
  onCheckOutChange,
  onSearch,
}: HomeHeroSectionProps) {
  const enHero = pickLocaleBundle(translationsJson, "en").hero;
  const leisureLabel = hero.leisure ?? enHero.leisure;
  const worldToursBase = hero.worldTours ?? enHero.worldTours;
  const searchGlobalToursLabel =
    hero.searchGlobalTours ?? enHero.searchGlobalTours;
  const worldToursCopy = {
    ...worldToursBase,
    search: searchGlobalToursLabel ?? worldToursBase.search,
  };

  const heroTabOptions = [
    {
      key: "accommodation" as const,
      label: hero.tabs.accommodation,
    },
    { key: "cars" as const, label: hero.tabs.cars },
    { key: "tours" as const, label: hero.tabs.excursions },
  ];
  const ActiveHeroTabIcon = HERO_TAB_ICONS[activeTab] ?? Home;

  return (
    <section
      id="home"
      className={heroSectionClass}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${HERO_BG}')`,
      }}
    >
      <div className={heroInnerClass}>
        <div aria-hidden className="hidden min-h-0 sm:block" />
        <div
          className={`mx-auto w-full max-w-5xl xl:max-w-6xl ${heroBlockStackClass}`}
        >
          <div className="text-center sm:mb-2">
            {excursionsIntermediaryNotice ? (
              <ExcursionsIntermediaryNotice
                text={excursionsIntermediaryNotice}
                as="h1"
                variant="hero"
                className="mx-auto max-w-3xl"
              />
            ) : (
              <h1 className={`${heroTitleClass} mb-0`}>{hero.title}</h1>
            )}
          </div>
          <div className={heroSearchInsetClass}>
            <div className={heroSearchWrapClass}>
              <DatesProvider
                settings={{
                  locale: dayjsLocale(language),
                  firstDayOfWeek: 1,
                  weekendDays: [0, 6],
                }}
              >
                <div className={heroSearchFieldsClass}>
                  <CompactSearchField
                    label={leisureLabel}
                    htmlFor="hero-leisure"
                    className="shrink-0 sm:min-w-[9.5rem] sm:max-w-[12.5rem] sm:flex-none"
                  >
                    <CompactSelect
                      id="hero-leisure"
                      value={activeTab}
                      onChange={onHeroTabChange}
                      ariaLabel={leisureLabel}
                      controlClassName={compactControlClass}
                      leadingIcon={
                        <ActiveHeroTabIcon
                          className="h-4 w-4 text-gray-500"
                          aria-hidden
                        />
                      }
                      options={heroTabOptions.map(({ key, label }) => ({
                        value: key,
                        label,
                      }))}
                    />
                  </CompactSearchField>

                  {activeTab === "accommodation" && (
                    <>
                      <CompactSearchField label={hero.accommodation.checkin}>
                        <HeroCompactDateInput
                          locale={language}
                          value={dates[0]}
                          aria-label={hero.accommodation.checkin}
                          onChange={onCheckInChange}
                        />
                      </CompactSearchField>
                      <CompactSearchField label={hero.accommodation.checkout}>
                        <HeroCompactDateInput
                          locale={language}
                          value={dates[1]}
                          min={dates[0]}
                          aria-label={hero.accommodation.checkout}
                          onChange={onCheckOutChange}
                        />
                      </CompactSearchField>
                      <CompactSearchField
                        label={hero.accommodation.guests}
                        htmlFor="hero-guests"
                      >
                        <CompactGuestSelect
                          id="hero-guests"
                          value={guests}
                          onChange={onGuestsChange}
                          max={10}
                          ariaLabel={hero.accommodation.guests}
                          controlClassName={compactControlClass}
                        />
                      </CompactSearchField>
                    </>
                  )}

                  {activeTab === "cars" && (
                    <>
                      <CompactSearchField
                        label={hero.cars.bodyType}
                        htmlFor="hero-car-body-type"
                      >
                        <CompactSelect
                          id="hero-car-body-type"
                          value={carType}
                          onChange={onCarTypeChange}
                          ariaLabel={hero.cars.bodyType}
                          controlClassName={compactControlClass}
                          options={hero.cars.bodyTypeOptions}
                        />
                      </CompactSearchField>
                      <CompactSearchField label={hero.cars.pickup}>
                        <HeroCompactDateInput
                          locale={language}
                          value={dates[0]}
                          aria-label={hero.cars.pickup}
                          onChange={onCheckInChange}
                        />
                      </CompactSearchField>
                      <CompactSearchField label={hero.cars.dropoff}>
                        <HeroCompactDateInput
                          locale={language}
                          value={dates[1]}
                          min={dates[0]}
                          aria-label={hero.cars.dropoff}
                          onChange={onCheckOutChange}
                        />
                      </CompactSearchField>
                    </>
                  )}

                  {activeTab === "tours" && (
                    <>
                      <CompactSearchField label={hero.excursions.date}>
                        <HeroCompactDateInput
                          locale={language}
                          value={dates[0]}
                          aria-label={hero.excursions.date}
                          onChange={onCheckInChange}
                        />
                      </CompactSearchField>
                      <CompactSearchField
                        label={hero.excursions.people}
                        htmlFor="hero-people"
                      >
                        <CompactGuestSelect
                          id="hero-people"
                          value={guests}
                          onChange={onGuestsChange}
                          max={20}
                          ariaLabel={hero.excursions.people}
                          controlClassName={compactControlClass}
                        />
                      </CompactSearchField>
                      <CompactSearchField
                        label={hero.excursions.language}
                        htmlFor="hero-tour-language"
                      >
                        <CompactSelect
                          id="hero-tour-language"
                          value={tourLanguage}
                          onChange={onTourLanguageChange}
                          ariaLabel={hero.excursions.language}
                          controlClassName={compactControlClass}
                          options={hero.excursions.languageOptions}
                        />
                      </CompactSearchField>
                    </>
                  )}
                </div>
                <HeroSearchCtaButton label={hero.search} onClick={onSearch} />
              </DatesProvider>
            </div>
          </div>
        </div>
        <div aria-hidden className="hidden min-h-0 sm:block" />
        <div
          className={`mx-auto w-full max-w-5xl xl:max-w-6xl ${heroBlockStackClass}`}
        >
          <h2
            className={`${heroTitleClass} mb-0 text-center sm:mb-2 md:mb-4`}
          >
            {worldToursCopy.heading}
          </h2>
          <WorldToursHeroSearch href={worldToursHref} labels={worldToursCopy} />
        </div>
        <div aria-hidden className="hidden min-h-0 sm:block" />
      </div>
    </section>
  );
}

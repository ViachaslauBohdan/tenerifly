"use client";

import type { MouseEvent } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useDataLoader } from "./useDataLoader";
import { DeferredSimpleBookingPopup } from "@/components/DeferredSimpleBookingPopup";
import { SiteHeader } from "@/components/SiteHeader";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { HomeAccommodationSection } from "@/components/home/HomeAccommodationSection";
import { HomeCarsSection } from "@/components/home/HomeCarsSection";
import { HomeTransfersSection } from "@/components/home/HomeTransfersSection";
import { HomeExcursionsSection } from "@/components/home/HomeExcursionsSection";
import { HomeBlogSection } from "@/components/home/HomeBlogSection";
import { BLOG_ENABLED } from "@/lib/siteFeatures";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HomeFooter } from "@/components/home/HomeFooter";
import { useBookingModal } from "@/components/home/useBookingModal";
import { useHeroSearch } from "@/components/home/useHeroSearch";
import type {
  HomeBlogPost,
  HomeCar,
  HomeProperty,
  LanguageCode,
  LocalePageInitialData,
} from "@/components/home/types";
import translationsJson from "@/i18n/main.json";
import payJson from "@/i18n/pay.json";
import { pickLocaleBundle, type Locale } from "@/types/locale";

type LocalePageClientProps = {
  initialData?: LocalePageInitialData;
  locale?: Locale;
};

export function LocalePageClient({
  initialData,
  locale: localeFromServer,
}: LocalePageClientProps) {
  const { locale, switchLocale, createLocaleLink } = useTranslation();
  const language = (localeFromServer || locale || "en") as LanguageCode;

  const {
    mounted,
    activeTab,
    dates,
    guests,
    setGuests,
    carType,
    setCarType,
    tourLanguage,
    setTourLanguage,
    onHeroTabChange,
    handleCheckInChange,
    handleCheckOutChange,
    handleSearch,
  } = useHeroSearch({ createLocaleLink });

  const { isOpen, bookingItem, bookingType, openBookingModal, closeBookingModal } =
    useBookingModal();

  const t = pickLocaleBundle(translationsJson, language);
  const payLabels = pickLocaleBundle(payJson, language);
  const excursionsIntermediaryNotice =
    (t.sections.excursions as { intermediaryNotice?: string })
      .intermediaryNotice ?? "";
  const legalPageTitle = (t as { legalPage?: { title?: string } }).legalPage
    ?.title;

  const dataFromHook = useDataLoader(mounted, language, {
    enabled: !initialData,
  });
  const cars: HomeCar[] = initialData
    ? initialData.cars || []
    : (dataFromHook.cars as HomeCar[]);
  const accommodation: HomeProperty[] = initialData
    ? initialData.properties || []
    : (dataFromHook.accommodation as HomeProperty[]);
  const blogPosts: HomeBlogPost[] = initialData
    ? initialData.blogs || []
    : (dataFromHook.blogPosts as HomeBlogPost[]);
  const transfers = initialData
    ? initialData.transfers || []
    : dataFromHook.transfers;
  const dataLoading = initialData ? false : dataFromHook.dataLoading;

  const handleLanguageChange = (langCode: LanguageCode) => {
    switchLocale(langCode);
  };

  const scrollToSection =
    (sectionId: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

  return (
    <main>
      <SiteHeader
        language={language}
        onLanguageChange={handleLanguageChange}
        selectLanguageLabel={t.selectLanguage}
        tabLabels={{
          accommodation: t.hero.tabs.accommodation,
          cars: t.hero.tabs.cars,
          excursions: t.hero.tabs.excursions,
          blog: t.hero.tabs.blog,
        }}
        variant="home"
        showTransfers={transfers.length > 0}
        payByCardLabel={payLabels.navLabel}
        createLocaleLink={createLocaleLink}
        onScrollToSection={scrollToSection}
      />

      <HomeHeroSection
        language={language}
        hero={t.hero}
        excursionsIntermediaryNotice={excursionsIntermediaryNotice}
        worldToursHref={createLocaleLink("/world-tours")}
        activeTab={activeTab}
        dates={dates}
        guests={guests}
        carType={carType}
        tourLanguage={tourLanguage}
        onHeroTabChange={onHeroTabChange}
        onGuestsChange={setGuests}
        onCarTypeChange={setCarType}
        onTourLanguageChange={setTourLanguage}
        onCheckInChange={handleCheckInChange}
        onCheckOutChange={handleCheckOutChange}
        onSearch={handleSearch}
      />

      <HomeAccommodationSection
        items={accommodation}
        dataLoading={dataLoading}
        copy={t.sections.accommodation}
        common={t.common}
        language={language}
        apartmentsHref={createLocaleLink("/apartments")}
        createLocaleLink={createLocaleLink}
        onBook={(item) => openBookingModal("accommodation", item)}
      />

      <HomeCarsSection
        items={cars}
        dataLoading={dataLoading}
        language={language}
        copy={t.sections.cars}
        common={t.common}
        carsHref={createLocaleLink("/cars")}
        createLocaleLink={createLocaleLink}
        onBook={(item) => openBookingModal("car", item)}
      />

      <HomeTransfersSection
        transfers={transfers}
        language={language}
        createLocaleLink={createLocaleLink}
        onBook={(item) => openBookingModal("transfer", item)}
      />

      <HomeExcursionsSection
        language={language}
        copy={t.sections.excursions}
        intermediaryNotice={excursionsIntermediaryNotice}
        toursHref={createLocaleLink("/tours")}
      />

      {BLOG_ENABLED ? (
        <HomeBlogSection
          items={blogPosts}
          dataLoading={dataLoading}
          copy={t.sections.blog}
          common={t.common}
          blogHref={createLocaleLink("/blog")}
          createLocaleLink={createLocaleLink}
        />
      ) : null}

      <HomeFaqSection copy={t.faq} />

      <HomeFooter
        footer={t.footer}
        excursionsTitle={t.sections.excursions.title}
        legalPageTitle={legalPageTitle}
        createLocaleLink={createLocaleLink}
      />

      {bookingItem && isOpen && (
        <DeferredSimpleBookingPopup
          opened={isOpen}
          onClose={closeBookingModal}
          item={{
            name: bookingItem.title,
            price: bookingItem.price,
            currency: bookingItem.currency,
            contactEmail: bookingItem.contact?.email,
          }}
          mode="contact"
          variant={bookingType === "accommodation" ? "apartment" : "default"}
          currentLocale={locale as Locale}
        />
      )}
    </main>
  );
}

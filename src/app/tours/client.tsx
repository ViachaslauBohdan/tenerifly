"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { getAtlanticoExcursionsAffiliateUrl } from "@/lib/excursionAggregatorUrls";
import { useTranslation } from "@/hooks/useTranslation";
import { pickLocaleBundle } from "@/types/locale";
import { CatalogBackLink } from "@/components/CatalogBackLink";
import { CatalogDetailShell } from "@/components/CatalogDetailShell";
import { ExcursionsIntermediaryNotice } from "@/components/ExcursionsIntermediaryNotice";
import translations from "@/i18n/tours.json";
import mainJson from "@/i18n/main.json";

type MainBundle = {
  sections?: {
    excursions?: {
      title?: string;
      subtitle?: string;
      intermediaryNotice?: string;
    };
  };
};

export default function ToursPageClient() {
  const { locale, createLocaleLink } = useTranslation();
  const language = locale;

  const t = pickLocaleBundle(translations, language);
  const mainT = pickLocaleBundle(mainJson as Record<string, MainBundle>, language);
  const excursionSection = mainT?.sections?.excursions;

  const atlanticoTagline =
    language === "ru"
      ? "Больше туров и активностей"
      : language === "pl"
        ? "Więcej wycieczek i aktywności"
        : language === "fr"
          ? "Plus de visites et d'activités"
          : language === "de"
            ? "Mehr Touren & Aktivitäten"
            : language === "es"
              ? "Más tours y actividades"
              : language === "ua"
                ? "Більше турів та активностей"
                : "More tours & activities";

  const atlanticoPartnerTitle =
    language === "ru"
      ? "Наш партнёр Atlántico Excursiones"
      : language === "pl"
        ? "Nasz partner: Atlántico Excursiones"
        : language === "fr"
          ? "Notre partenaire Atlántico Excursiones"
          : language === "de"
            ? "Unser Partner Atlántico Excursiones"
            : language === "es"
              ? "Nuestro socio Atlántico Excursiones"
              : language === "ua"
                ? "Партнер Atlántico Excursiones"
                : "Our partner Atlántico Excursiones";

  const atlanticoDescription =
    language === "ru"
      ? "Автобусные туры, тематические парки, морские прогулки и VIP — бронируйте с Atlántico Excursiones."
      : language === "pl"
        ? "Wycieczki autokarowe, parki rozrywki, rejsy i VIP — rezerwuj z Atlántico Excursiones."
        : language === "fr"
          ? "Circuits en bus, parcs à thème, croisières et expériences VIP — réservez avec Atlántico Excursiones."
          : language === "de"
            ? "Busreisen, Freizeitparks, Bootstouren und VIP — buchen Sie bei Atlántico Excursiones."
            : language === "es"
              ? "Excursiones en bus, parques temáticos, barcos y experiencias VIP — reserva con Atlántico Excursiones."
              : language === "ua"
                ? "Автобусні тури, парки розваг, морські прогулянки та VIP — бронюйте з Atlántico Excursiones."
                : "Coach tours, theme parks, boat trips and VIP experiences — book with Atlántico Excursiones.";

  const atlanticoCtaLabel =
    language === "ru"
      ? "Посмотреть все туры"
      : language === "pl"
        ? "Zobacz wszystkie wycieczki"
        : language === "fr"
          ? "Voir toutes les visites"
          : language === "de"
            ? "Alle Touren anzeigen"
            : language === "es"
              ? "Ver todos los tours"
              : language === "ua"
                ? "Переглянути всі тури"
                : "View all tours";

  return (
    <CatalogDetailShell>
      <CatalogBackLink href={createLocaleLink("/")} label={t.backToHome} />

      <div className="mb-8 text-center">
        {(excursionSection?.intermediaryNotice ?? t.intermediaryNotice) ? (
          <>
            <ExcursionsIntermediaryNotice
              text={
                excursionSection?.intermediaryNotice ??
                t.intermediaryNotice ??
                ""
              }
              as="h1"
              variant="page"
              className="mx-auto max-w-3xl"
            />
            {excursionSection?.subtitle ? (
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                {excursionSection.subtitle}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <h1 className="mb-3 text-3xl font-bold text-gray-900">
              {excursionSection?.title ?? t.toursInTenerife}
            </h1>
            {excursionSection?.subtitle ? (
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                {excursionSection.subtitle}
              </p>
            ) : null}
          </>
        )}
      </div>

      <div className="mx-auto mb-10 w-full max-w-6xl">
        <div className="overflow-hidden rounded-2xl border-2 border-blue-200 bg-white shadow-xl ring-1 ring-blue-100 transition-all duration-300 hover:shadow-2xl">
          <div className="flex min-h-0 flex-col md:flex-row">
            <div className="flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-8 md:w-[38%] md:px-10 md:py-9">
              <div className="text-center">
                <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20 shadow-inner md:h-16 md:w-16">
                  <MapPin className="h-7 w-7 text-white md:h-8 md:w-8" aria-hidden />
                </div>
                <h2 className="mb-1 text-xl font-bold text-white md:text-2xl">
                  Atlántico Excursiones
                </h2>
                <p className="text-sm text-blue-100 md:text-base">{atlanticoTagline}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center px-8 py-8 md:w-[62%] md:px-10 md:py-9">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 md:text-xl">
                {atlanticoPartnerTitle}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-600 md:text-base">
                {atlanticoDescription}
              </p>
              <a
                href={getAtlanticoExcursionsAffiliateUrl(language)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl sm:w-fit sm:min-w-[220px]"
              >
                {atlanticoCtaLabel}
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </CatalogDetailShell>
  );
}

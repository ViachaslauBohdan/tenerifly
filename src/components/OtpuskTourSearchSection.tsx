"use client";

import {
  useOtpuskSearch,
  type OtpuskSearchStatus,
  type UseOtpuskSearchOptions,
} from "@/hooks/useOtpuskSearch";
import translationsJson from "@/i18n/main.json";
import { pickLocaleBundle } from "@/types/locale";

type OtpuskTourSearchSectionProps = {
  language: UseOtpuskSearchOptions["language"];
  searchContainerId?: string;
  tourContainerId?: string;
  className?: string;
};

const translations = translationsJson as Record<
  string,
  { common: { loading: string } }
>;

function OtpuskSearchLoader({ label }: { label: string }) {
  return (
    <div
      className="mx-auto max-w-[1200px] px-3 sm:px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div className="relative min-h-[212px] overflow-hidden rounded sm:min-h-[228px]">
        <div className="absolute inset-0 rounded bg-gradient-to-r from-[#4c9ce0] via-[#54a3e6] to-[#65b2f3] p-4 sm:p-5">
          <div className="mb-4 h-5 w-28 animate-pulse rounded bg-white/25" />
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded bg-white/70 sm:h-11"
              />
            ))}
          </div>
          <div className="mt-3 h-10 w-full animate-pulse rounded bg-[#f7941d]/80 sm:mt-4" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded bg-sky-700/20 backdrop-blur-[2px]">
          <div
            className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/35 border-t-white shadow-sm"
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-white drop-shadow-sm">{label}</p>
        </div>
      </div>
    </div>
  );
}

export function OtpuskTourSearchSection({
  language,
  searchContainerId = "otpusk-search-container",
  tourContainerId = "otpusk-tour-container",
  className = "bg-gray-50 pt-10 pb-16 sm:pb-20",
}: OtpuskTourSearchSectionProps) {
  const searchContainer = `#${searchContainerId}`;
  const tourContainer = `#${tourContainerId}`;

  const status: OtpuskSearchStatus = useOtpuskSearch({
    language,
    searchContainer,
    tourContainer,
  });

  const isReady = status === "ready" || status === "error";
  const loadingLabel = pickLocaleBundle(translations, language).common.loading;

  return (
    <section className={`${className} overflow-x-hidden`}>
      <div className="relative mx-auto max-w-[1200px]">
        {!isReady && <OtpuskSearchLoader label={loadingLabel} />}
        <div
          id={searchContainerId}
          className={`new_os otpusk-search-host mx-auto min-h-[120px] w-full max-w-[1200px] px-3 transition-opacity duration-200 sm:px-4 ${
            isReady
              ? "relative opacity-100"
              : "pointer-events-none absolute inset-x-0 top-0 opacity-0"
          }`}
          aria-busy={!isReady}
          aria-live="polite"
        />
      </div>
      <div
        id={tourContainerId}
        className={`mx-auto max-w-[1200px] px-3 transition-opacity duration-200 sm:px-4 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
      />
    </section>
  );
}

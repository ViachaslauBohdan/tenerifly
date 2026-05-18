"use client";

import {
  useOtpuskSearch,
  type OtpuskSearchStatus,
  type UseOtpuskSearchOptions,
} from "@/hooks/useOtpuskSearch";

type OtpuskTourSearchSectionProps = {
  language: UseOtpuskSearchOptions["language"];
  searchContainerId?: string;
  tourContainerId?: string;
  className?: string;
};

function OtpuskSearchSkeleton() {
  return (
    <div
      className="mx-auto max-w-[1200px] overflow-hidden rounded px-3 sm:px-4"
      aria-hidden="true"
    >
      <div className="rounded bg-gradient-to-r from-[#4c9ce0] via-[#54a3e6] to-[#65b2f3] p-4 sm:p-5">
        <div className="mb-4 h-5 w-28 rounded bg-white/25" />
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-10 rounded bg-white shadow-sm sm:h-11"
            />
          ))}
        </div>
        <div className="mt-3 h-10 w-full rounded bg-[#f7941d] sm:mt-4" />
        <div className="mt-3 h-4 w-40 rounded bg-white/20" />
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

  return (
    <section className={`${className} overflow-x-hidden`}>
      <div className="relative mx-auto max-w-[1200px] px-3 sm:px-4">
        {!isReady && <OtpuskSearchSkeleton />}
        <div
          id={searchContainerId}
          className={`new_os otpusk-search-host mx-auto min-h-[120px] w-full max-w-[1200px] transition-opacity duration-200 ${
            isReady ? "relative opacity-100" : "pointer-events-none absolute inset-x-3 top-0 opacity-0 sm:inset-x-4"
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

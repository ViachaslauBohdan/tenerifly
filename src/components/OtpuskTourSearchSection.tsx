"use client";

import {
  useOtpuskSearch,
  type UseOtpuskSearchOptions,
} from "@/hooks/useOtpuskSearch";

type OtpuskTourSearchSectionProps = {
  language: UseOtpuskSearchOptions["language"];
  searchContainerId?: string;
  tourContainerId?: string;
  className?: string;
};

export function OtpuskTourSearchSection({
  language,
  searchContainerId = "otpusk-search-container",
  tourContainerId = "otpusk-tour-container",
  className = "bg-gray-50 pt-10 pb-16 sm:pb-20",
}: OtpuskTourSearchSectionProps) {
  const searchContainer = `#${searchContainerId}`;
  const tourContainer = `#${tourContainerId}`;

  useOtpuskSearch({
    language,
    searchContainer,
    tourContainer,
  });

  return (
    <section className={className}>
      <div
        id={searchContainerId}
        className="new_os otpusk-search-host mx-auto min-h-[120px] w-full max-w-[1200px] px-4 min-[400px]:px-5 sm:px-6"
      />
      <div
        id={tourContainerId}
        className="mx-auto max-w-[1200px] px-4 min-[400px]:px-5 sm:px-6"
      />
    </section>
  );
}

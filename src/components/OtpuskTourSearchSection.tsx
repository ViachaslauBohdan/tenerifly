"use client";

import { OtpuskBodyClassGuard } from "@/components/OtpuskBodyClassGuard";
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
    <section className={`${className} overflow-x-hidden`}>
      <OtpuskBodyClassGuard />
      <div
        id={searchContainerId}
        className="new_os otpusk-search-host mx-auto min-h-[120px] w-full max-w-[1200px] px-3 sm:px-4"
      />
      <div
        id={tourContainerId}
        className="mx-auto max-w-[1200px] px-3 sm:px-4"
      />
    </section>
  );
}

"use client";

import { useOtpuskSearch, type UseOtpuskSearchOptions } from "@/hooks/useOtpuskSearch";

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

  useOtpuskSearch({ language, searchContainer, tourContainer });

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&subset=cyrillic"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://export.otpusk.com/os/onsite/form.css"
        type="text/css"
      />
      <link
        rel="stylesheet"
        href="https://export.otpusk.com/os/onsite/result.css"
        type="text/css"
      />
      <link
        rel="stylesheet"
        href="https://export.otpusk.com/os/onsite/tour.css"
        type="text/css"
      />
      <div className="new_os" />
      <section className={className}>
        <div
          id={searchContainerId}
          className="mx-auto max-w-[1200px] px-3 sm:px-4"
        />
        <div
          id={tourContainerId}
          className="mx-auto max-w-[1200px] px-3 sm:px-4"
        />
      </section>
    </>
  );
}

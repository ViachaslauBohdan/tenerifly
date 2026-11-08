/** Shared layout for homepage hero search (Tenerife) and World Tours white bar. */

/** Horizontal inset for hero and page content on small screens. */
export const heroGutterClass =
  "px-4 min-[400px]:px-5 sm:px-6 md:px-8";

/** Page-level hero heading above the search card. */
export const heroTitleClass =
  "text-xl font-bold leading-snug text-white drop-shadow-lg sm:text-2xl md:text-3xl lg:text-4xl";

/** Title inside the World Tours blue search card — smaller than page headings. */
export const heroCardTitleClass =
  "text-base font-bold leading-snug text-white sm:text-lg";

/** Homepage hero — photo frames the title and search, without a tall empty band. */
export const heroSectionClass =
  "relative flex min-h-0 flex-col bg-cover bg-center bg-no-repeat";

/** Inner hero stack — header clearance plus photo above the title and below the search. */
export const heroInnerClass =
  `relative z-10 flex w-full flex-col justify-start pt-[8.25rem] pb-14 min-[400px]:pt-[8.75rem] sm:items-center sm:pt-[10rem] sm:pb-28 md:pt-[10rem] ${heroGutterClass}`;

/** Space between title and search card inside each hero group. */
export const heroBlockStackClass = "flex flex-col gap-3 sm:gap-4";

/** Optional extra inset inside gutter (kept at 0 — cards align to hero gutter). */
export const heroSearchInsetClass = "";

/** World Tours blue card — single padding wrapper on mobile. */
export const heroWorldToursCardClass =
  "flex flex-col gap-2 px-3 py-3 sm:gap-2.5 sm:px-5 sm:py-5 md:px-8";

export const heroSearchWrapClass =
  "flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_16px_48px_rgba(15,23,42,0.28)] sm:min-h-[68px] sm:flex-row";

export const heroSearchFieldsClass =
  "flex min-h-[52px] flex-1 flex-col divide-y divide-gray-300 sm:min-h-[68px] sm:flex-row sm:divide-x sm:divide-y-0";

/** Hint cell — same spacing as hero fields, regular body weight. */
export const heroSearchHintClass =
  "flex min-w-0 flex-1 items-center px-3 py-2 text-sm font-normal leading-relaxed text-gray-600 sm:px-5 sm:py-[15px] sm:text-base sm:leading-snug";

/** Shared layout for homepage hero search (Tenerife) and World Tours white bar. */

/** Horizontal inset for hero and page content on small screens. */
export const heroGutterClass =
  "px-4 min-[400px]:px-5 sm:px-6 md:px-8";

/** Page-level hero headings (H1 + worldwide tours line above the blue card). */
export const heroTitleClass =
  "text-xl font-bold leading-snug text-white drop-shadow-lg sm:text-2xl md:text-3xl lg:text-4xl";

/** Title inside the World Tours blue search card — smaller than page headings. */
export const heroCardTitleClass =
  "text-base font-bold leading-snug text-white sm:text-lg";

/** Homepage hero — mobile: content height only; sm+: viewport band. */
export const heroSectionClass =
  "relative flex min-h-0 flex-col bg-cover bg-center bg-no-repeat pb-8 sm:min-h-[70vh] sm:pb-0";

/** Homepage hero (title + single CTA). */
export const heroSectionCompactClass =
  "relative flex flex-col bg-cover bg-center bg-no-repeat pb-8 sm:min-h-[55vh] sm:justify-center sm:pb-10";

export const heroInnerCompactClass =
  `relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-4 pt-[5rem] pb-6 min-[400px]:pt-[5.5rem] sm:gap-5 sm:pt-[5.5rem] sm:pb-8 md:pt-[5.75rem] ${heroGutterClass}`;

export const heroBlockStackCompactClass =
  "mx-auto flex w-full max-w-6xl flex-col gap-4 sm:max-w-7xl sm:gap-5";

export const heroTitleCompactClass = heroTitleClass;

export const heroCtaWrapCompactClass =
  "mx-auto flex w-full max-w-xs flex-col overflow-hidden rounded-xl bg-white shadow-[0_16px_48px_rgba(15,23,42,0.28)] min-[400px]:max-w-sm sm:max-w-md sm:min-h-[68px]";

/** Inner hero stack — gap between Stays block and World Tours block on mobile. */
export const heroInnerClass =
  `relative z-10 flex w-full flex-col justify-start gap-4 pt-[5.25rem] pb-6 min-[400px]:gap-5 min-[400px]:pt-[5.75rem] sm:min-h-0 sm:flex-1 sm:justify-center sm:grid sm:grid-rows-[1fr_auto_1fr_auto_1fr] sm:items-center sm:gap-0 sm:pt-[5.5rem] sm:pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] md:pt-[5.5rem] ${heroGutterClass}`;

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

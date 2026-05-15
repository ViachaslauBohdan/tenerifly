type TourTaglinesHeaderProps = {
  dreamTrip: string;
  tourOfTheDay: string;
  chooseTour: string;
  variant?: "hero" | "page";
  className?: string;
};

export function TourTaglinesHeader({
  dreamTrip,
  tourOfTheDay,
  chooseTour,
  variant = "page",
  className = "",
}: TourTaglinesHeaderProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={`w-full text-center ${isHero ? "mt-5 sm:mt-8 mb-6 sm:mb-8" : "mb-6 sm:mb-8"} ${className}`}
    >
      <h2
        className={
          isHero
            ? "mb-3 text-4xl font-bold text-white drop-shadow-lg sm:mb-4 md:text-5xl lg:text-6xl"
            : "mb-2 px-2 text-2xl font-bold text-gray-900 min-[400px]:text-3xl sm:mb-3 md:text-4xl lg:text-5xl"
        }
      >
        {dreamTrip}
      </h2>
      <p
        className={
          isHero
            ? "mx-auto max-w-2xl px-3 text-lg text-white/90 drop-shadow-md sm:px-4 md:text-xl"
            : "mx-auto max-w-2xl px-3 text-base text-gray-600 sm:px-4 sm:text-lg md:text-xl"
        }
      >
        <span className="block sm:inline">{tourOfTheDay}</span>
        <span
          className={
            isHero
              ? "mx-2 hidden text-white/60 sm:inline"
              : "mx-2 hidden text-gray-400 sm:inline"
          }
          aria-hidden="true"
        >
          ·
        </span>
        <span className="mt-1 block sm:mt-0 sm:inline">{chooseTour}</span>
      </p>
    </div>
  );
}

"use client";

import { Car, Home, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { HomeCardImage } from "@/components/HomeCardImage";
import { HomeEmptyState } from "@/components/home/HomeEmptyState";
import { TileCarPrice, formatTileAmount } from "@/components/TilePriceBadge";
import { ViewAllLink } from "@/components/ViewAllLink";
import {
  getCanariasRentacarAffiliateUrl,
  getCanariasRentacarBannerImageUrl,
} from "@/lib/canariasAffiliate";
import {
  getHomeCarCurrency,
  getHomeCarFeatures,
  getHomeCarPrice,
} from "@/components/home/homeCars";
import { getHomeCarImageUrl, HOME_DISPLAY_LIMIT } from "@/lib/homeListing";
import type { BookingItem, HomeCar, LanguageCode } from "@/components/home/types";
import type { Locale } from "@/types/locale";
import translationsJson from "@/i18n/main.json";

type CarsCopy = (typeof translationsJson)["en"]["sections"]["cars"];
type CommonCopy = (typeof translationsJson)["en"]["common"];

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";

type HomeCarsSectionProps = {
  items: HomeCar[];
  dataLoading: boolean;
  language: LanguageCode;
  copy: CarsCopy;
  common: CommonCopy;
  carsHref: string;
  createLocaleLink: (path: string) => string;
  onBook: (item: BookingItem) => void;
};

export function HomeCarsSection({
  items,
  dataLoading,
  language,
  copy,
  common,
  carsHref,
  createLocaleLink,
  onBook,
}: HomeCarsSectionProps) {
  const router = useRouter();
  const currencyMap: Record<string, string> = {};

  return (
    <section
      id="cars"
      className="scroll-mt-[6.5rem] pt-20 md:scroll-mt-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16 sm:flex-row sm:justify-between sm:items-center">
          <div className="min-w-0 w-full text-center sm:flex-1">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {copy.title}
            </h2>
            <p className="text-xl text-gray-600">{copy.subtitle}</p>
          </div>
          <ViewAllLink href={carsHref}>{copy.viewAll}</ViewAllLink>
        </div>

        <div className="flex justify-center mb-10">
          <a
            href={getCanariasRentacarAffiliateUrl(language)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <img
              src={getCanariasRentacarBannerImageUrl(language)}
              alt="rentacar canarias.com"
              className="max-w-full h-auto"
            />
          </a>
        </div>

        {dataLoading ? (
          <HomeEmptyState
            type="loading"
            serverErrorLabel={common.serverError}
            noDataLabel={common.noData}
          />
        ) : items.length === 0 ? (
          <HomeEmptyState
            type="empty"
            serverErrorLabel={common.serverError}
            noDataLabel={common.noData}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.slice(0, HOME_DISPLAY_LIMIT).map((car) => {
              const imageSrc = getHomeCarImageUrl(car, STRAPI_API_URL);
              if (!imageSrc) return null;
              const detailHref = createLocaleLink(`/cars/${car.documentId}`);
              const currency = getHomeCarCurrency(car, currencyMap);
              const price = getHomeCarPrice(car);

              return (
                <div
                  key={car.documentId || car.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <HomeCardImage
                      src={imageSrc}
                      alt={car.title}
                      onClick={() => router.push(detailHref)}
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        type="button"
                        onClick={() => router.push(detailHref)}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 sm:hidden"
                        aria-label={common.viewDetails}
                      >
                        <svg
                          className="w-4 h-4 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {car.title}
                      </h3>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-yellow-700">
                          {car.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {car.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Car className="w-4 h-4" />
                        <span>
                          {copy.transmission}:{" "}
                          {car.specifications?.transmission || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Home className="w-4 h-4" />
                        <span>
                          {copy.features}: {getHomeCarFeatures(car)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <TileCarPrice
                          currencySymbol={currency}
                          amount={price}
                          perDaySuffix={common.perDay}
                          locale={language as Locale}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          onBook({
                            title: car.title,
                            price: `${currency.trim()} ${formatTileAmount(price, language as Locale)}${common.perDay}`,
                            brand: car.specifications?.make,
                            model: car.specifications?.model,
                            duration: car.duration,
                            language: car.language,
                            contact: car.contact,
                          })
                        }
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {common.bookNow}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

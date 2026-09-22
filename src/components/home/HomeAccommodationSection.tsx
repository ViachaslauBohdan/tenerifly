"use client";

import { Home, MapPin, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { HomeCardImage } from "@/components/HomeCardImage";
import { HomeEmptyState } from "@/components/home/HomeEmptyState";
import { TilePriceBadge } from "@/components/TilePriceBadge";
import { ViewAllLink } from "@/components/ViewAllLink";
import type { BookingItem, HomeProperty, LanguageCode } from "@/components/home/types";
import { getApartmentBookingCopy } from "@/lib/apartmentBookingCopy";
import translationsJson from "@/i18n/main.json";

type AccommodationCopy = (typeof translationsJson)["en"]["sections"]["accommodation"];
type CommonCopy = (typeof translationsJson)["en"]["common"];

type HomeAccommodationSectionProps = {
  items: HomeProperty[];
  dataLoading: boolean;
  copy: AccommodationCopy;
  common: CommonCopy;
  language: LanguageCode;
  apartmentsHref: string;
  createLocaleLink: (path: string) => string;
  onBook: (item: BookingItem) => void;
};

export function HomeAccommodationSection({
  items,
  dataLoading,
  copy,
  common,
  language,
  apartmentsHref,
  createLocaleLink,
  onBook,
}: HomeAccommodationSectionProps) {
  const router = useRouter();
  const previewItems = items.slice(0, 3);
  const apartmentBooking = getApartmentBookingCopy(language);

  return (
    <section
      id="accommodation"
      className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16 sm:flex-row sm:justify-between sm:items-center">
          <div className="min-w-0 w-full text-center sm:flex-1">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {copy.title}
            </h2>
            <p className="text-xl text-gray-600">{copy.subtitle}</p>
          </div>
          <ViewAllLink href={apartmentsHref}>{copy.viewAll}</ViewAllLink>
        </div>

        {dataLoading ? (
          <HomeEmptyState
            type="loading"
            serverErrorLabel={common.serverError}
            noDataLabel={common.noData}
          />
        ) : previewItems.length === 0 ? (
          <HomeEmptyState
            type="empty"
            serverErrorLabel={common.serverError}
            noDataLabel={common.noData}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewItems.map((place) => {
              const detailHref = createLocaleLink(
                `/apartments/${place.documentId}`
              );
              return (
                <div
                  key={place.documentId || place.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <HomeCardImage
                      src={place.image || "/placeholder.svg"}
                      alt={place.title}
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
                        {place.title}
                      </h3>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-yellow-700">
                          {place.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {place.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {copy.location}: {place.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Home className="w-4 h-4" />
                        <span>
                          {copy.amenities}: {place.amenities}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <TilePriceBadge>
                          <span className="text-sm font-semibold tabular-nums text-yellow-900">
                            {place.price?.startsWith("≈")
                              ? place.price
                              : place.price
                                ? `≈ ${place.price}`
                                : place.price}
                          </span>
                        </TilePriceBadge>
                      </div>
                      {place.price ? (
                        <p className="text-xs leading-snug text-gray-500">
                          {apartmentBooking.priceDisclaimer}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          onBook({
                            title: place.title,
                            price: place.price,
                            currency: place.currency,
                            duration: place.duration,
                            language: place.language,
                            brand: place.brand,
                            model: place.model,
                            contact: place.contact,
                          })
                        }
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {apartmentBooking.checkPrice}
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

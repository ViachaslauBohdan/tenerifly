"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { pickLocaleBundle } from "@/types/locale";
import { CatalogBackLink } from "@/components/CatalogBackLink";
import { CatalogDetailShell } from "@/components/CatalogDetailShell";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DeferredSimpleBookingPopup } from "@/components/DeferredSimpleBookingPopup";
import { ApartmentManagerContactPopup } from "@/components/ApartmentManagerContactPopup";
import translations from "@/i18n/carsDetail.json";
import { carTransmissionLabel } from "@/lib/carSpecLabels";
import { getApartmentBookingCopy } from "@/lib/apartmentBookingCopy";
import { IconBrandTelegram, IconBrandWhatsapp } from "@tabler/icons-react";

interface CarData {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  description: string;
  type: "rent" | "sale";
  car_status: "available" | "reserved" | "rented" | "sold";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images: Array<{
    id: number;
    url: string;
    width?: number;
    height?: number;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  }>;
  rental_prices?: {
    day_1: number;
    day_3?: number;
    day_7?: number;
    month: number;
    currency: string;
  } | null;
  specifications?: {
    make: string;
    model: string;
    year: number;
    mileage?: number;
    fuel: string;
    transmission: string;
    power: number;
    seats: number;
    doors: number;
    color: string;
    body_type: string;
    drive_type: string;
  } | null;
  features?: {
    air_conditioning: boolean;
    bluetooth: boolean;
    navigation: boolean;
    parking_sensors: boolean;
    other_features?: string;
  } | null;
  location?: {
    city: string;
    region?: string | null;
    address: string;
  } | null;
  contact?: {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
    telegram?: string;
    preferred_contact: string;
  } | null;
}

export default function CarDetailPageClient({ car }: { car: CarData }) {
  const { locale, createLocaleLink } = useTranslation();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isManagerContactOpen, setIsManagerContactOpen] = useState(false);
  const requestCopy = getApartmentBookingCopy(locale);

  const t = pickLocaleBundle(translations, locale);

  const getImageUrl = (imageUrl: string) => {
    // Если URL уже полный (начинается с http), возвращаем как есть
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    // Если URL относительный, добавляем базовый URL Strapi
    const apiUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
    return `${apiUrl}${imageUrl}`;
  };

  const getFuelText = (fuel: string) => {
    switch (fuel) {
      case "petrol":
      case "gasoline":
        return t.petrol;
      case "diesel":
        return t.diesel;
      case "hybrid":
        return t.hybrid;
      case "electric":
        return t.electric;
      default:
        return fuel;
    }
  };

  const getTransmissionText = (transmission: string) =>
    carTransmissionLabel(transmission, locale);

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return t.available;
      case "reserved":
        return t.reserved;
      case "sold":
        return t.sold;
      default:
        return status.toUpperCase();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "sold":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFeatures = () => {
    const features: string[] = [];
    if (car?.features) {
      if (car.features.air_conditioning) features.push(t.airConditioning);
      if (car.features.bluetooth) features.push(t.bluetooth);
      if (car.features.navigation) features.push(t.navigation);
      if (car.features.parking_sensors) features.push(t.parkingSensors);
    }
    return features;
  };

  const handleOpenBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };


  const renderImageCarousel = () => {
    if (car.images && car.images.length > 0) {
      return (
        <Carousel className="w-full">
          <CarouselContent>
            {car.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
                  <Image
                    src={getImageUrl(image.url)}
                    alt={`${car.title} - Image ${index + 1}`}
                    width={800}
                    height={600}
                    className="object-contain max-w-full max-h-[600px] rounded-lg"
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      maxHeight: "600px",
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {car.images.length > 1 && (
            <>
              <CarouselPrevious className="left-4 z-10 bg-white/80 hover:bg-white border-2 border-gray-200 shadow-lg" />
              <CarouselNext className="right-4 z-10 bg-white/80 hover:bg-white border-2 border-gray-200 shadow-lg" />
            </>
          )}
        </Carousel>
      );
    }

    return (
      <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
        <span className="text-gray-400">{t.noImagesAvailable}</span>
      </div>
    );
  };

  const renderTechnicalSpecs = () => {
    if (!car.specifications) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t.technicalSpecs}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">{t.brand}:</span>
            <span className="font-medium text-gray-900">
              {car.specifications.make || t.noData}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">{t.model}:</span>
            <span className="font-medium text-gray-900">
              {car.specifications.model || t.noData}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">{t.year}:</span>
            <span className="font-medium text-gray-900">
              {car.specifications.year || t.noData}
            </span>
          </div>
          {car.specifications.mileage && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">{t.mileage}:</span>
              <span className="font-medium text-gray-900">
                {car.specifications.mileage
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                {t.km}
              </span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">{t.fuel}:</span>
            <span className="font-medium text-gray-900">
              {getFuelText(car.specifications.fuel) || t.noData}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">{t.transmission}:</span>
            <span className="font-medium text-gray-900">
              {getTransmissionText(car.specifications.transmission) || t.noData}
            </span>
          </div>
          {/*<div className="flex justify-between py-2 border-b border-gray-100">*/}
          {/*  <span className="text-gray-600">{t.power}:</span>*/}
          {/*  <span className="font-medium text-gray-900">*/}
          {/*    {car.specifications.power*/}
          {/*      ? `${car.specifications.power} ${t.hp}`*/}
          {/*      : t.noData}*/}
          {/*  </span>*/}
          {/*</div>*/}
          {/*<div className="flex justify-between py-2 border-b border-gray-100">*/}
          {/*  <span className="text-gray-600">{t.doors}:</span>*/}
          {/*  <span className="font-medium text-gray-900">*/}
          {/*    {car.specifications.doors || t.noData}*/}
          {/*  </span>*/}
          {/*</div>*/}
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">{t.seats}:</span>
            <span className="font-medium text-gray-900">
              {car.specifications.seats || t.noData}
            </span>
          </div>
          {/*<div className="flex justify-between py-2 border-b border-gray-100">*/}
          {/*  <span className="text-gray-600">{t.color}:</span>*/}
          {/*  <span className="font-medium text-gray-900">*/}
          {/*    {car.specifications.color || t.noData}*/}
          {/*  </span>*/}
          {/*</div>*/}
          {/*<div className="flex justify-between py-2 border-b border-gray-100">*/}
          {/*  <span className="text-gray-600">{t.bodyType}:</span>*/}
          {/*  <span className="font-medium text-gray-900">*/}
          {/*    {car.specifications.body_type || t.noData}*/}
          {/*  </span>*/}
          {/*</div>*/}
          {/*<div className="flex justify-between py-2 border-b border-gray-100">*/}
          {/*  <span className="text-gray-600">{t.driveType}:</span>*/}
          {/*  <span className="font-medium text-gray-900">*/}
          {/*    {car.specifications.drive_type || t.noData}*/}
          {/*  </span>*/}
          {/*</div>*/}
        </div>
      </div>
    );
  };

  const renderEquipment = () => {
    const features = getFeatures();
    if (features.length === 0) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t.equipment}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((item, index) => (
            <div key={index} className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRentalPrices = () => {
    if (car.type !== "rent" || !car.rental_prices) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t.rentalPrices}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {car.rental_prices.day_1 && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {car.rental_prices.currency}{" "}
                {car.rental_prices.day_1.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">{t.perDay}</div>
            </div>
          )}
          {car.rental_prices.day_3 && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {car.rental_prices.currency}{" "}
                {car.rental_prices.day_3.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">{t.per3Days}</div>
            </div>
          )}
          {car.rental_prices.day_7 && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {car.rental_prices.currency}{" "}
                {car.rental_prices.day_7.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">{t.perWeek}</div>
            </div>
          )}
          {car.rental_prices.month && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {car.rental_prices.currency}{" "}
                {car.rental_prices.month.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">{t.perMonth}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLocation = () => {
    if (!car.location) return null;

    return (
      <div className="flex items-center text-gray-600 mb-6">
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-sm">
          {car.location.region
            ? `${car.location.city}, ${car.location.region}`
            : car.location.city}
        </span>
      </div>
    );
  };

  const renderKeyFeatures = () => {
    if (!car.features) return null;

    return (
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
        <div className="space-y-2">
          {car.features.air_conditioning && (
            <div className="flex items-center text-sm">
              <svg
                className="w-4 h-4 text-blue-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Air Conditioning</span>
            </div>
          )}
          {car.features.bluetooth && (
            <div className="flex items-center text-sm">
              <svg
                className="w-4 h-4 text-blue-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Bluetooth</span>
            </div>
          )}
          {car.features.navigation && (
            <div className="flex items-center text-sm">
              <svg
                className="w-4 h-4 text-blue-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Navigation</span>
            </div>
          )}
          {car.features.parking_sensors && (
            <div className="flex items-center text-sm">
              <svg
                className="w-4 h-4 text-blue-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Parking Sensors</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActionButtons = () => {
    if (car.car_status !== "available") return null;

    return (
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleOpenBookingModal}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          {requestCopy.checkPrice}
        </button>
        <button
          type="button"
          onClick={() => setIsManagerContactOpen(true)}
          className="w-full bg-[#25D366] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1ebe57] focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-colors inline-flex items-center justify-center gap-2"
        >
          <IconBrandWhatsapp className="h-5 w-5 shrink-0" stroke={2} />
          <IconBrandTelegram className="h-5 w-5 shrink-0" stroke={2} />
          {requestCopy.contactManager}
        </button>
      </div>
    );
  };

  return (
    <CatalogDetailShell>
        <CatalogBackLink
          href={createLocaleLink("/cars")}
          label={t.backToCars}
        />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{car.title}</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            {/* Image Carousel */}
            <div className="mb-8 relative">{renderImageCarousel()}</div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t.description}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {car.description || t.noData}
              </p>
            </div>

            {/* Technical Specifications */}
            {renderTechnicalSpecs()}

            {/* Equipment */}
            {renderEquipment()}

            {/* Rental Prices */}
            {renderRentalPrices()}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 xl:sticky xl:top-6">
              {/* Status */}
              <div className="flex gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(car.car_status)}`}
                >
                  {getStatusText(car.car_status)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    car.type === "rent"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {car.type === "rent" ? t.rent : t.sale}
                </span>
              </div>

              {/* Location */}
              {renderLocation()}

              {/* Key Features */}
              {renderKeyFeatures()}

              {/* Action Buttons */}
              {renderActionButtons()}
            </div>
          </div>
        </div>

        {car && isBookingModalOpen && (
          <DeferredSimpleBookingPopup
            opened={isBookingModalOpen}
            onClose={handleCloseBookingModal}
            item={{
              name: car.title,
              price: car.rental_prices
                ? `${car.rental_prices.currency} ${car.rental_prices.day_1.toLocaleString()}/day`
                : undefined,
              currency: car.rental_prices?.currency,
              contactEmail: car.contact?.email,
            }}
            variant="car"
            currentLocale={locale}
          />
        )}

        {isManagerContactOpen && (
          <ApartmentManagerContactPopup
            opened={isManagerContactOpen}
            onClose={() => setIsManagerContactOpen(false)}
            propertyTitle={car.title}
            locale={locale}
          />
        )}
    </CatalogDetailShell>
  );
}
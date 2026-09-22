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
import translations from "@/i18n/apartmentDetail.json";
import {
  formatPropertyPriceWithCurrency,
  getPropertyPeriodLabel,
} from "@/utils/propertyPrice";
import { getApartmentBookingCopy } from "@/lib/apartmentBookingCopy";
import { whatsAppInterestHref } from "@/utils/whatsapp";

interface PropertyData {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  description: string;
  type: "rent" | "sale";
  property_status: "available" | "reserved" | "rented" | "sold";
  featured: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images: Array<{
    id: number;
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  }>;
  price?: {
    amount: number;
    currency: string;
    period: string;
  } | null;
  location?: {
    address: string;
    city: string;
    region: string;
    postal_code: string;
    latitude: number;
    longitude: number;
  } | null;
  features?: {
    has_pool: boolean;
    has_garden: boolean;
    has_garage: boolean;
    has_terrace: boolean;
    has_security: boolean;
    has_air_conditioning: boolean;
    has_heating: boolean;
    has_internet: boolean;
    furnished: boolean;
    additional_features?: string | null;
  } | null;
  specifications?: {
    total_area: number;
    living_area: number;
    bedrooms: number;
    bathrooms: number;
    floor: number;
    total_floors: number;
    year_built?: number | null;
    parking_spaces?: number | null;
  } | null;
  rental_terms?: {
    minimum_stay: number;
    maximum_stay: number;
    deposit_amount: number;
    utilities_included: boolean;
    pets_allowed: boolean;
    smoking_allowed: boolean;
    additional_terms?: string | null;
  } | null;
  sale_terms?: {
    price: number;
    currency: string;
    payment_terms?: string;
    additional_terms?: string;
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

export default function PropertyDetailPage({
  property,
}: {
  property: PropertyData;
}) {
  const { locale, createLocaleLink } = useTranslation();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const t = pickLocaleBundle(translations, locale);

  const getImageUrl = (imageUrl: string) => {
    // Изображения загружаются динамически без предзагрузки
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://tenerifly-strapi-production.up.railway.app";
    return `${apiUrl}${imageUrl}`;
  };

  const getPropertyTypeText = (category: string) => {
    switch (category) {
      case "apartment":
        return t.apartment;
      case "house":
        return t.house;
      case "plot":
        return t.plot;
      default:
        return category;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return t.available;
      case "reserved":
        return t.reserved;
      case "rented":
        return t.rented;
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
      case "rented":
        return "bg-red-100 text-red-800";
      case "sold":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeText = (type: string) => {
    return type === "rent" ? t.rent : t.sale;
  };

  const getTypeColor = (type: string) => {
    return type === "rent"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  const formatStayDuration = (duration: number) => {
    return `${duration} ${duration === 1 ? t.month : t.months}`;
  };

  const getBooleanText = (value: boolean) => {
    return value ? t.yes : t.no;
  };

  const handleOpenBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const handleImageLoad = (imageId: number) => {
    setLoadedImages((prev) => new Set(prev).add(imageId));
  };

  return (
    <CatalogDetailShell>
        <CatalogBackLink
          href={createLocaleLink("/apartments")}
          label={t.backToProperties}
        />

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            {/* Image Gallery with Carousel */}
            <div className="mb-8">
              {property.images && property.images.length > 0 ? (
                <div className="relative">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {property.images.map((image, index) => (
                        <CarouselItem key={image.id}>
                          <div className="relative">
                            <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                              <Image
                                src={getImageUrl(image.url)}
                                alt={`${property.title} - Image ${index + 1}`}
                                fill
                                className={`object-cover transition-opacity duration-300 ${
                                  loadedImages.has(image.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
                                quality={85}
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                onLoad={() => handleImageLoad(image.id)}
                              />
                            </div>
                            {/* Image counter */}
                            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {index + 1} / {property.images.length}
                            </div>
                            {/* Loading indicator */}
                            {!loadedImages.has(image.id) && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4 z-10 bg-white/90 hover:bg-white border-2 border-gray-200 shadow-lg" />
                    <CarouselNext className="right-4 z-10 bg-white/90 hover:bg-white border-2 border-gray-200 shadow-lg" />
                  </Carousel>

                  {/* Thumbnail grid below carousel */}
                  {property.images.length > 1 && (
                    <div className="mt-4 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                      {property.images.slice(0, 8).map((image, index) => (
                        <div
                          key={`thumb-${image.id}`}
                          className="aspect-square relative bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:opacity-75 transition-opacity group"
                        >
                          <Image
                            src={getImageUrl(image.url)}
                            alt={`${property.title} - Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            loading="lazy"
                            sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 12vw"
                            quality={60}
                          />
                          {/* Hover effect */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
                        </div>
                      ))}
                      {property.images.length > 8 && (
                        <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-sm text-gray-600 font-medium">
                            +{property.images.length - 8}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400">No images available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t.description}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Specifications */}
            {property.specifications && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {t.specifications}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.propertyType}:</span>
                    <span className="font-medium text-gray-900">
                      {getPropertyTypeText(property.category)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.bedrooms}:</span>
                    <span className="font-medium text-gray-900">
                      {property.specifications.bedrooms}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.bathrooms}:</span>
                    <span className="font-medium text-gray-900">
                      {property.specifications.bathrooms}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.totalArea}:</span>
                    <span className="font-medium text-gray-900">
                      {property.specifications.total_area} {t.sqm}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.livingArea}:</span>
                    <span className="font-medium text-gray-900">
                      {property.specifications.living_area} {t.sqm}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.floor}:</span>
                    <span className="font-medium text-gray-900">
                      {property.specifications.floor}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.totalFloors}:</span>
                    <span className="font-medium text-gray-900">
                      {property.specifications.total_floors}
                    </span>
                  </div>
                  {property.specifications.year_built && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t.yearBuilt}:</span>
                      <span className="font-medium text-gray-900">
                        {property.specifications.year_built}
                      </span>
                    </div>
                  )}
                  {property.specifications.parking_spaces && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{t.parkingSpaces}:</span>
                      <span className="font-medium text-gray-900">
                        {property.specifications.parking_spaces}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            {property.location && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {t.location}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.address}:</span>
                    <span className="font-medium text-gray-900">
                      {property.location.address}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.city}:</span>
                    <span className="font-medium text-gray-900">
                      {property.location.city}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.region}:</span>
                    <span className="font-medium text-gray-900">
                      {property.location.region}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.postalCode}:</span>
                    <span className="font-medium text-gray-900">
                      {property.location.postal_code}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            {property.features && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {t.features}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.has_pool && (
                    <div className="flex items-center">
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
                      <span className="text-gray-700">{t.hasPool}</span>
                    </div>
                  )}
                  {property.features.has_garden && (
                    <div className="flex items-center">
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
                      <span className="text-gray-700">{t.hasGarden}</span>
                    </div>
                  )}
                  {property.features.has_garage && (
                    <div className="flex items-center">
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
                      <span className="text-gray-700">{t.hasGarage}</span>
                    </div>
                  )}
                  {property.features.has_terrace && (
                    <div className="flex items-center">
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
                      <span className="text-gray-700">{t.hasTerrace}</span>
                    </div>
                  )}
                  {property.features.has_security && (
                    <div className="flex items-center">
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
                      <span className="text-gray-700">{t.hasSecurity}</span>
                    </div>
                  )}
                  {property.features.has_air_conditioning && (
                    <div className="flex items-center">
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
                      <span className="text-gray-700">
                        {t.hasAirConditioning}
                      </span>
                    </div>
                  )}
                  {property.features.has_heating && (
                    <div className="flex items-center">
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
                      <span className="text-gray-700">{t.hasHeating}</span>
                    </div>
                  )}
                  {property.features.has_internet && (
                    <div className="flex items-center">
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
                      <span className="text-gray-700">{t.hasInternet}</span>
                    </div>
                  )}
                  {property.features.furnished && (
                    <div className="flex items-center">
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
                      <span className="text-gray-700">{t.furnished}</span>
                    </div>
                  )}
                </div>
                {property.features.additional_features && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-600">
                      {property.features.additional_features}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Rental Terms */}
            {property.rental_terms && property.type === "rent" && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {t.rentalTerms}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.minimumStay}:</span>
                    <span className="font-medium text-gray-900">
                      {formatStayDuration(property.rental_terms.minimum_stay)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.maximumStay}:</span>
                    <span className="font-medium text-gray-900">
                      {formatStayDuration(property.rental_terms.maximum_stay)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.depositAmount}:</span>
                    <span className="font-medium text-gray-900">
                      €{property.rental_terms.deposit_amount}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">
                      {t.utilitiesIncluded}:
                    </span>
                    <span className="font-medium text-gray-900">
                      {getBooleanText(property.rental_terms.utilities_included)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.petsAllowed}:</span>
                    <span className="font-medium text-gray-900">
                      {getBooleanText(property.rental_terms.pets_allowed)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t.smokingAllowed}:</span>
                    <span className="font-medium text-gray-900">
                      {getBooleanText(property.rental_terms.smoking_allowed)}
                    </span>
                  </div>
                </div>
                {property.rental_terms.additional_terms && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {t.additionalTerms}:
                    </h3>
                    <p className="text-gray-600">
                      {property.rental_terms.additional_terms}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 xl:sticky xl:top-6">
              {/* Status and Type */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.property_status)}`}
                >
                  {getStatusText(property.property_status)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(property.type)}`}
                >
                  {getTypeText(property.type)}
                </span>
              </div>

              {/* Price */}
              {property.price && (
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ≈ {property.price.currency}{" "}
                    {property.price.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    / {getPropertyPeriodLabel(property.price.period, locale)}
                  </div>
                  <p className="mt-2 text-xs leading-snug text-gray-500">
                    {getApartmentBookingCopy(locale).priceDisclaimer}
                  </p>
                </div>
              )}

              {/* Location */}
              {property.location && (
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
                    {property.location.city}, {property.location.region}
                  </span>
                </div>
              )}

              {/* Key Amenities */}
              {property.features && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {t.keyAmenities}
                  </h3>
                  <div className="space-y-2">
                    {property.features.has_pool && (
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
                        <span className="text-gray-700">{t.hasPool}</span>
                      </div>
                    )}
                    {property.features.has_garden && (
                      <div className="flex items-center text-sm">
                        <svg
                          className="w-4 h-4 text-green-600 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{t.hasGarden}</span>
                      </div>
                    )}
                    {property.features.has_terrace && (
                      <div className="flex items-center text-sm">
                        <svg
                          className="w-4 h-4 text-orange-600 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{t.hasTerrace}</span>
                      </div>
                    )}
                    {property.features.has_air_conditioning && (
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
                        <span className="text-gray-700">
                          {t.hasAirConditioning}
                        </span>
                      </div>
                    )}
                    {property.features.has_internet && (
                      <div className="flex items-center text-sm">
                        <svg
                          className="w-4 h-4 text-purple-600 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{t.hasInternet}</span>
                      </div>
                    )}
                    {property.features.furnished && (
                      <div className="flex items-center text-sm">
                        <svg
                          className="w-4 h-4 text-brown-600 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{t.furnished}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {property.property_status === "available" && (
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleOpenBookingModal}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {getApartmentBookingCopy(locale).checkPrice}
                  </button>
                  <a
                    href={whatsAppInterestHref(
                      "accommodation",
                      {
                        title: property.title,
                        price: property.price
                          ? formatPropertyPriceWithCurrency({
                              amount: property.price.amount,
                              currency: property.price.currency,
                              period: property.price.period,
                              language: locale,
                            })
                          : undefined,
                      },
                      locale
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1ebe57] focus:outline-none focus:ring-2 focus:ring-[#25D366] transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    {getApartmentBookingCopy(locale).contactManager}
                  </a>
                </div>
              )}

              {property.contact?.telegram && (
                <a
                  href={`https://t.me/${property.contact.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors flex items-center justify-center mt-3"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  {t.telegram}
                </a>
              )}
            </div>
          </div>
        </div>

        {property && isBookingModalOpen && (
          <DeferredSimpleBookingPopup
            opened={isBookingModalOpen}
            onClose={handleCloseBookingModal}
            item={{
              name: property.title,
              price: property.price
                ? formatPropertyPriceWithCurrency({
                    amount: property.price.amount,
                    currency: property.price.currency,
                    period: property.price.period,
                    language: locale,
                  })
                : undefined,
              currency: property.price?.currency,
              contactEmail: property.contact?.email,
            }}
            variant="apartment"
            currentLocale={locale}
          />
        )}
    </CatalogDetailShell>
  );
}

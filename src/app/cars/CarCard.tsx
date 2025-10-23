"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SimpleBookingPopup } from "@/components/SimpleBookingPopup";

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
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  }>;
  rental_prices?: {
    day_1: number;
    currency: string;
  } | null;
  location?: {
    city: string;
    region?: string | null;
    address: string;
  } | null;
  features?: {
    air_conditioning: boolean;
    bluetooth: boolean;
    navigation: boolean;
    parking_sensors: boolean;
  } | null;
  specifications?: {
    make: string;
    model: string;
    year: number;
    fuel: string;
    transmission: string;
    power: number;
    seats: number;
    doors: number;
    color: string;
    body_type: string;
    drive_type: string;
  } | null;
  contact?: {
    name: string;
    email: string;
    phone: string;
  } | null;
}

interface CarCardProps {
  translations: {
    available: string;
    viewDetails: string;
    bookNow: string;
    sportyDescription: string;
    petrol: string;
    diesel: string;
    hybrid: string;
    electric: string;
    automatic: string;
    manual: string;
    priceFrom: string;
    pricePerDay: string;
    currency: {
      EUR: string;
      USD: string;
      GBP: string;
    };
    tenerifeLocations: {
      south: string;
      north: string;
      center: string;
    };
  };
  language: string;
  cars?: CarData[]; // Добавляем пропс для отфильтрованных машин
}

const getFoundCarsText = (locale: string): string => {
  const texts: Record<string, string> = {
    en: "Found cars",
    ru: "Найдено автомобилей",
    pl: "Znaleziono samochodów",
    fr: "Voitures trouvées",
    uk: "Знайдено автомобілів",
    de: "Gefundene Autos",
    es: "Coches encontrados",
  };
  return texts[locale] || texts.en;
};

const getFilterActiveText = (locale: string): string => {
  const texts: Record<string, string> = {
    en: "🔍 Filter active",
    ru: "🔍 Фильтр активен",
    pl: "🔍 Filtr aktywny",
    fr: "🔍 Filtre actif",
    uk: "🔍 Фільтр активний",
    de: "🔍 Filter aktiv",
    es: "🔍 Filtro activo",
  };
  return texts[locale] || texts.en;
};

const CarCard = ({
  translations,
  language,
  cars: filteredCars,
}: CarCardProps) => {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);

  // Функция для создания заголовков с авторизацией
  const getAuthHeaders = () => {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    // Если есть отфильтрованные машины, используем их
    if (filteredCars) {
      setCars(filteredCars);
      setLoading(false);
      return;
    }

    // Если нет отфильтрованных машин, загружаем все
    const fetchCars = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        console.log("CarCard API URL:", apiUrl); // Для отладки

        const response = await fetch(
          `${apiUrl}/api/documents/cars?populate=*`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch cars: ${response.status}`);
        }

        const data = await response.json();
        setCars(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filteredCars]);

  // Обновляем машины при изменении отфильтрованного списка
  useEffect(() => {
    if (filteredCars) {
      setCars(filteredCars);
      setLoading(false);
    }
  }, [filteredCars]);

  const handleViewDetails = (carDocumentId: string) => {
    window.location.href = `/cars/${carDocumentId}`;
  };

  const handleOpenBookingModal = (car: CarData) => {
    setSelectedCar(car);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedCar(null);
  };

  const getImageUrl = (car: CarData) => {
    if (car.images && car.images.length > 0) {
      // Если URL уже полный (начинается с http), возвращаем как есть
      if (car.images[0].url.startsWith("http")) {
        return car.images[0].url;
      }
      // Если URL относительный, добавляем базовый URL Strapi
      const apiUrl =
        process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
      return `${apiUrl}${car.images[0].url}`;
    }
    return "/placeholder.svg?height=200&width=300";
  };

  const getPrice = (car: CarData) => {
    if (car.rental_prices && car.rental_prices.day_1) {
      return car.rental_prices.day_1;
    }
    return 45;
  };

  const getCurrency = (car: CarData) => {
    if (car.rental_prices && car.rental_prices.currency) {
      return car.rental_prices.currency;
    }
    return "EUR";
  };

  const getLocalizedCurrency = (car: CarData) => {
    const currency = getCurrency(car);
    return (
      translations.currency[currency as keyof typeof translations.currency] ||
      currency
    );
  };

  const getLocation = (car: CarData) => {
    if (car.location && car.location.city) {
      if (car.location.region) {
        return `${car.location.city}, ${car.location.region}`;
      }
      return car.location.city;
    }
    return "—";
  };

  const getTransmission = (car: CarData) => {
    if (car.specifications && car.specifications.transmission) {
      return car.specifications.transmission === "automatic"
        ? translations.automatic
        : car.specifications.transmission === "manual"
          ? translations.manual
          : car.specifications.transmission;
    }
    return "—";
  };

  const getFuelType = (car: CarData) => {
    if (car.specifications && car.specifications.fuel) {
      switch (car.specifications.fuel) {
        case "petrol":
        case "gasoline":
          return translations.petrol;
        case "diesel":
          return translations.diesel;
        case "hybrid":
          return translations.hybrid;
        case "electric":
          return translations.electric;
        default:
          return car.specifications.fuel;
      }
    }
    return "—";
  };

  const getDoors = (car: CarData) => {
    if (car.specifications && car.specifications.doors) {
      return car.specifications.doors;
    }
    return "—";
  };

  const getPower = (car: CarData) => {
    if (car.specifications && car.specifications.power) {
      return car.specifications.power;
    }
    return "—";
  };

  const getYear = (car: CarData) => {
    if (car.specifications && car.specifications.year) {
      return car.specifications.year;
    }
    return new Date(car.createdAt).getFullYear();
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return translations.available;
      case "reserved":
        return "RESERVED";
      case "rented":
        return "RENTED";
      case "sold":
        return "SOLD";
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

  const getPowerUnit = () => {
    switch (language) {
      case "en":
        return "hp";
      case "ru":
        return "л.с.";
      case "pl":
        return "KM";
      case "fr":
        return "ch";
      case "uk":
        return "к.с.";
      default:
        return "hp";
    }
  };

  const getDoorsText = () => {
    switch (language) {
      case "en":
        return "doors";
      case "ru":
        return "двери";
      case "pl":
        return "drzwi";
      case "fr":
        return "portes";
      case "uk":
        return "двері";
      default:
        return "doors";
    }
  };

  const getFeatures = (car: CarData) => {
    const features = [];
    if (car.features) {
      if (car.features.air_conditioning) features.push("Air Conditioner");
      if (car.features.bluetooth) features.push("Bluetooth");
      if (car.features.navigation) features.push("Navigation");
      if (car.features.parking_sensors) features.push("Parking Sensors");
    }

    if (features.length === 0) {
      return ["—"];
    }

    return features;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-2">Error loading cars</div>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <div className="text-gray-500 text-lg mb-2">
          {filteredCars !== undefined
            ? "Нет автомобилей, соответствующих выбранным фильтрам"
            : "No cars available"}
        </div>
        {filteredCars !== undefined && (
          <div className="text-gray-400 text-sm">
            Попробуйте изменить параметры фильтрации
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Счетчик результатов */}
      <div className="flex items-center justify-between">
        <div className="text-gray-600">
          {getFoundCarsText(language)}:{" "}
          <span className="font-semibold text-gray-900">{cars.length}</span>
        </div>
        {filteredCars !== undefined && (
          <div className="text-sm text-blue-600">
            {getFilterActiveText(language)}
          </div>
        )}
      </div>

      {/* Сетка автомобилей */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video relative bg-gray-100">
              <Image
                src={getImageUrl(car)}
                alt={car.title}
                fill
                className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleViewDetails(car.documentId)}
              />
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={() => handleViewDetails(car.documentId)}
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 sm:hidden"
                >
                  <svg
                    className="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
              <div className="mb-3">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {car.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {car.type === "rent" ? "For Rent" : "For Sale"} •{" "}
                  {getYear(car)}
                </p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {car.description}
                </p>
              </div>

              {/* Car Details */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 18.657A8 8 0 716.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    />
                  </svg>
                  {getFuelType(car)}
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {getTransmission(car)}
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  {getDoors(car) === "—"
                    ? "—"
                    : `${getDoors(car)} ${getDoorsText()}`}
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {getPower(car) === "—"
                    ? "—"
                    : `${getPower(car)} ${getPowerUnit()}`}
                </div>
                <div className="flex items-center col-span-2">
                  <svg
                    className="w-4 h-4 mr-1"
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
                  {getLocation(car)}
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-4">
                {getFeatures(car)
                  .slice(0, 3)
                  .map((feature, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs ${
                        feature === "—"
                          ? "bg-gray-100 text-gray-500"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
              </div>

              {/* Availability and Price */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(car.car_status)}`}
                >
                  {getStatusText(car.car_status)}
                </span>
                {car.type === "rent" && (
                  <div className="text-right">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {translations.priceFrom} {getLocalizedCurrency(car)}{" "}
                      {getPrice(car)}
                      {translations.pricePerDay}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {(car.car_status === "available" ||
                  car.car_status === "reserved") && (
                  <button
                    onClick={() => handleOpenBookingModal(car)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center justify-center"
                  >
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {translations.bookNow}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedCar && (
        <SimpleBookingPopup
          opened={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          item={{
            name: selectedCar.title,
            price: selectedCar.rental_prices
              ? `${getLocalizedCurrency(selectedCar)} ${getPrice(selectedCar)}${translations.pricePerDay}`
              : undefined,
            currency: selectedCar.rental_prices?.currency,
            contactEmail: selectedCar.contact?.email,
          }}
        />
      )}
    </div>
  );
};

export default CarCard;

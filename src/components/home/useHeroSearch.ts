"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getIsoDatePlusDays,
  getTodayIsoDate,
  isIsoDate,
} from "@/lib/dateLocale";
import { type HeroTab, isHeroTab, parseHeroTab } from "@/lib/heroTab";

const HERO_DATES_STORAGE_KEY = "hero-search-dates";

const DEFAULT_ACCOMMODATION_FILTERS = {
  rooms: "",
  priceFrom: "",
  priceTo: "",
  city: "",
  district: "Tenerife",
};

const DEFAULT_CAR_FILTERS = {
  brand: "",
  model: "",
  yearFrom: "",
  yearTo: "",
  priceFrom: "",
  priceTo: "",
  fuel: "",
  transmission: "",
  location: "",
};

type UseHeroSearchOptions = {
  createLocaleLink: (path: string) => string;
};

export function useHeroSearch({ createLocaleLink }: UseHeroSearchOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<HeroTab>(() =>
    parseHeroTab(searchParams.get("tab"))
  );
  const [dates, setDates] = useState<[string, string]>(() => {
    const today = getTodayIsoDate();
    return [today, getIsoDatePlusDays(today, 5)];
  });
  const [guests, setGuests] = useState(2);
  const [carType, setCarType] = useState("");
  const [tourLanguage, setTourLanguage] = useState("en");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HERO_DATES_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { checkIn?: string; checkOut?: string };
      if (!parsed.checkIn || !parsed.checkOut) return;
      if (!isIsoDate(parsed.checkIn) || !isIsoDate(parsed.checkOut)) return;
      const normalizedCheckOut =
        parsed.checkOut < parsed.checkIn ? parsed.checkIn : parsed.checkOut;
      setDates([parsed.checkIn, normalizedCheckOut]);
    } catch {
      // Ignore invalid persisted data.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      HERO_DATES_STORAGE_KEY,
      JSON.stringify({ checkIn: dates[0], checkOut: dates[1] })
    );
  }, [dates]);

  useEffect(() => {
    if (!mounted) return;
    setActiveTab(parseHeroTab(searchParams.get("tab")));
  }, [mounted, searchParams]);

  const selectHeroTab = (tab: HeroTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleCheckInChange = (nextCheckIn: string) => {
    setDates(([, currentCheckOut]) => {
      if (!nextCheckIn) return ["", currentCheckOut];
      if (!currentCheckOut || currentCheckOut < nextCheckIn) {
        return [nextCheckIn, nextCheckIn];
      }
      return [nextCheckIn, currentCheckOut];
    });
  };

  const handleCheckOutChange = (nextCheckOut: string) => {
    setDates(([currentCheckIn]) => {
      if (!nextCheckOut) return [currentCheckIn, ""];
      if (currentCheckIn && nextCheckOut < currentCheckIn) {
        return [currentCheckIn, currentCheckIn];
      }
      return [currentCheckIn, nextCheckOut];
    });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (dates[0]) params.append("checkIn", dates[0]);
    if (dates[1]) params.append("checkOut", dates[1]);

    switch (activeTab) {
      case "cars": {
        if (carType) params.append("bodyType", carType);
        const carFilters = DEFAULT_CAR_FILTERS;
        if (carFilters.brand) params.append("brand", carFilters.brand);
        if (carFilters.model) params.append("model", carFilters.model);
        if (carFilters.yearFrom) params.append("yearFrom", carFilters.yearFrom);
        if (carFilters.yearTo) params.append("yearTo", carFilters.yearTo);
        if (carFilters.priceFrom)
          params.append("priceFrom", carFilters.priceFrom);
        if (carFilters.priceTo) params.append("priceTo", carFilters.priceTo);
        if (carFilters.fuel) params.append("fuel", carFilters.fuel);
        if (carFilters.transmission)
          params.append("transmission", carFilters.transmission);
        if (carFilters.location) params.append("location", carFilters.location);
        router.push(`${createLocaleLink("/cars")}?${params.toString()}`);
        break;
      }
      case "accommodation": {
        const accommodationFilters = DEFAULT_ACCOMMODATION_FILTERS;
        if (accommodationFilters.rooms)
          params.append("rooms", accommodationFilters.rooms);
        if (accommodationFilters.priceFrom)
          params.append("priceFrom", accommodationFilters.priceFrom);
        if (accommodationFilters.priceTo)
          params.append("priceTo", accommodationFilters.priceTo);
        if (accommodationFilters.city)
          params.append("city", accommodationFilters.city);
        if (accommodationFilters.district)
          params.append("district", accommodationFilters.district);
        if (guests) params.append("guests", guests.toString());
        router.push(`${createLocaleLink("/apartments")}?${params.toString()}`);
        break;
      }
      case "tours": {
        if (dates[0]) params.append("date", dates[0]);
        if (guests) params.append("people", guests.toString());
        params.append("language", tourLanguage);
        router.push(`${createLocaleLink("/tours")}?${params.toString()}`);
        break;
      }
    }
  };

  const onHeroTabChange = (value: string) => {
    if (isHeroTab(value)) selectHeroTab(value);
  };

  return {
    mounted,
    activeTab,
    dates,
    guests,
    setGuests,
    carType,
    setCarType,
    tourLanguage,
    setTourLanguage,
    selectHeroTab,
    onHeroTabChange,
    handleCheckInChange,
    handleCheckOutChange,
    handleSearch,
  };
}

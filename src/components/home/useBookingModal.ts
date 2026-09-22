"use client";

import { useEffect, useState } from "react";
import { preloadSimpleBookingPopup } from "@/components/DeferredSimpleBookingPopup";
import type { BookingItem } from "@/components/home/types";

export type BookingItemType =
  | "excursion"
  | "car"
  | "accommodation"
  | "transfer"
  | "package";

export function useBookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState<BookingItem | null>(null);
  const [bookingType, setBookingType] = useState<BookingItemType | null>(null);

  useEffect(() => {
    preloadSimpleBookingPopup();
  }, []);

  const openBookingModal = (type: BookingItemType, item: BookingItem) => {
    preloadSimpleBookingPopup();
    setBookingType(type);
    setBookingItem(item);
    setIsOpen(true);
  };

  const closeBookingModal = () => {
    setIsOpen(false);
    setBookingItem(null);
    setBookingType(null);
  };

  return {
    isOpen,
    bookingItem,
    bookingType,
    openBookingModal,
    closeBookingModal,
  };
}

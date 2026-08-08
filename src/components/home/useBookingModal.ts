"use client";

import { useEffect, useState } from "react";
import { preloadSimpleBookingPopup } from "@/components/DeferredSimpleBookingPopup";
import type { BookingItem } from "@/components/home/types";

export type BookingItemType =
  | "excursion"
  | "car"
  | "accommodation"
  | "transfer";

export function useBookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState<BookingItem | null>(null);

  useEffect(() => {
    preloadSimpleBookingPopup();
  }, []);

  const openBookingModal = (_type: BookingItemType, item: BookingItem) => {
    preloadSimpleBookingPopup();
    setBookingItem(item);
    setIsOpen(true);
  };

  const closeBookingModal = () => {
    setIsOpen(false);
    setBookingItem(null);
  };

  return {
    isOpen,
    bookingItem,
    openBookingModal,
    closeBookingModal,
  };
}

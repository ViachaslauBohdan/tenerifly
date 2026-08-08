"use client";

import { useState } from "react";
import type { BookingItem } from "@/components/home/types";

export type BookingItemType =
  | "excursion"
  | "car"
  | "accommodation"
  | "transfer";

export function useBookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState<BookingItem | null>(null);

  const openBookingModal = (_type: BookingItemType, item: BookingItem) => {
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

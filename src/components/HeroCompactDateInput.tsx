"use client";

import { DatePickerInput } from "@mantine/dates";
import {
  dateToIsoString,
  getDateValueFormat,
  isoStringToDate,
} from "@/lib/dateLocale";
import type { Locale } from "@/types/locale";

const compactInputClass =
  "w-full min-w-0 border-0 bg-transparent p-0 text-left text-base font-semibold leading-snug text-gray-900 shadow-none outline-none focus:ring-0 placeholder:text-left placeholder:font-normal placeholder:text-gray-400 compact-date-input";

type HeroCompactDateInputProps = {
  value: string;
  onChange: (iso: string) => void;
  locale: Locale;
  min?: string;
  "aria-label": string;
};

export function HeroCompactDateInput({
  value,
  onChange,
  locale,
  min,
  "aria-label": ariaLabel,
}: HeroCompactDateInputProps) {
  const minDate = min ? isoStringToDate(min) ?? undefined : undefined;

  return (
    <DatePickerInput
      value={isoStringToDate(value)}
      onChange={(date) => onChange(dateToIsoString(date))}
      valueFormat={getDateValueFormat(locale)}
      minDate={minDate}
      aria-label={ariaLabel}
      popoverProps={{ withinPortal: true, zIndex: 300 }}
      classNames={{
        root: "w-full",
        input: compactInputClass,
        wrapper: "w-full justify-start",
      }}
      styles={{
        root: {
          width: "100%",
        },
        wrapper: {
          width: "100%",
          justifyContent: "flex-start",
        },
        input: {
          minHeight: "unset",
          height: "auto",
          cursor: "pointer",
          textAlign: "left",
          border: "none",
          boxShadow: "none",
          backgroundColor: "transparent",
        },
        section: { pointerEvents: "none" },
      }}
    />
  );
}

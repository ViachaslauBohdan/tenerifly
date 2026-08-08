"use client";

import { Users } from "lucide-react";
import { CompactSelect } from "@/components/home/CompactSelect";

const GUEST_COUNT_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

type CompactGuestSelectProps = {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  ariaLabel: string;
  controlClassName: string;
};

function getGuestCountOptions(max: number) {
  if (max === 10) return GUEST_COUNT_OPTIONS;
  return Array.from({ length: max }, (_, i) => i + 1);
}

function clampGuestCount(value: number, max: number) {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(value, max);
}

export function CompactGuestSelect({
  id,
  value,
  onChange,
  max = 10,
  ariaLabel,
  controlClassName,
}: CompactGuestSelectProps) {
  const options = getGuestCountOptions(max).map((count) => ({
    value: String(count),
    label: String(count),
  }));
  const safeValue = clampGuestCount(value, max);

  return (
    <CompactSelect
      id={id}
      value={String(safeValue)}
      onChange={(next) => onChange(Number(next))}
      options={options}
      ariaLabel={ariaLabel}
      controlClassName={controlClassName}
      leadingIcon={
        <Users className="h-4 w-4 text-gray-400" aria-hidden />
      }
    />
  );
}

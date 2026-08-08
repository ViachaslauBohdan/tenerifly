"use client";

import { useId } from "react";
import { createPortal } from "react-dom";
import { Users } from "lucide-react";
import { useCompactGuestSelectMenu } from "@/components/home/useCompactGuestSelectMenu";

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
  const options = getGuestCountOptions(max);
  const safeValue = clampGuestCount(value, max);
  const listboxId = useId();
  const {
    open,
    mounted,
    menuStyle,
    rootRef,
    triggerRef,
    listRef,
    handleToggle,
    handleClose,
    handleTriggerKeyDown,
    closeAndFocusTrigger,
  } = useCompactGuestSelectMenu();

  const handleSelect = (count: number) => {
    onChange(count);
    closeAndFocusTrigger();
  };

  return (
    <div
      ref={rootRef}
      className="relative flex w-full min-w-0 items-center self-stretch"
    >
      <Users
        className="pointer-events-none absolute left-0 z-10 h-4 w-4 text-gray-400"
        aria-hidden
      />
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        data-value={safeValue}
        className={`${controlClassName} min-h-8 w-full cursor-pointer py-0.5 pl-6 text-left`}
        onClick={handleToggle}
        onKeyDown={handleTriggerKeyDown}
      >
        {safeValue}
      </button>

      {mounted &&
        open &&
        createPortal(
          <>
            <div
              aria-hidden
              className="fixed inset-0 z-[1090] bg-black/40 sm:bg-transparent"
              onClick={handleClose}
            />
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-label={ariaLabel}
              style={menuStyle}
              className="z-[1100] overflow-y-auto overscroll-contain rounded-xl border border-gray-200 bg-white py-1 shadow-2xl ring-1 ring-black/5"
            >
              {options.map((count) => {
                const selected = count === safeValue;
                return (
                  <li key={count} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      tabIndex={-1}
                      className={`flex min-h-12 w-full items-center px-4 text-left text-base font-semibold text-gray-900 sm:min-h-10 sm:px-3 sm:text-sm ${
                        selected
                          ? "bg-sky-50 text-sky-800"
                          : "hover:bg-gray-50 active:bg-gray-100"
                      }`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(count)}
                    >
                      {count}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>,
          document.body
        )}
    </div>
  );
}

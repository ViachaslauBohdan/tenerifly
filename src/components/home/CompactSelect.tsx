"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { createPortal } from "react-dom";
import { useCompactSelectMenu } from "@/components/home/useCompactSelectMenu";

export type CompactSelectOption = {
  value: string;
  label: string;
};

type CompactSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: CompactSelectOption[];
  ariaLabel: string;
  controlClassName: string;
  leadingIcon?: ReactNode;
};

export function CompactSelect({
  id,
  value,
  onChange,
  options,
  ariaLabel,
  controlClassName,
  leadingIcon,
}: CompactSelectProps) {
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
  } = useCompactSelectMenu();

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];
  const selectedValue = selectedOption?.value ?? value;
  const selectedLabel = selectedOption?.label ?? value;

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    closeAndFocusTrigger();
  };

  return (
    <div
      ref={rootRef}
      className="relative flex w-full min-w-0 items-center self-stretch"
    >
      {leadingIcon ? (
        <span className="pointer-events-none absolute left-0 z-10 flex items-center">
          {leadingIcon}
        </span>
      ) : null}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        data-value={selectedValue}
        className={`${controlClassName} min-h-8 w-full cursor-pointer py-0.5 text-left ${
          leadingIcon ? "pl-6" : ""
        }`}
        onClick={handleToggle}
        onKeyDown={handleTriggerKeyDown}
      >
        {selectedLabel}
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
              {options.map((option) => {
                const selected = option.value === selectedValue;
                return (
                  <li key={option.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      data-value={option.value}
                      tabIndex={-1}
                      className={`flex min-h-12 w-full items-center px-4 text-left text-base font-semibold text-gray-900 sm:min-h-10 sm:px-3 sm:text-sm ${
                        selected
                          ? "bg-sky-50 text-sky-800"
                          : "hover:bg-gray-50 active:bg-gray-100"
                      }`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(option.value)}
                    >
                      {option.label}
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

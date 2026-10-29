"use client";

import { useEffect, useRef, useState } from "react";
import { catalogSearchCopy } from "@/lib/catalogSearch";

export const SEARCH_DEBOUNCE_MS = 800;

type CatalogSearchFieldProps = {
  locale: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function CatalogSearchField({
  locale,
  value,
  onChange,
  placeholder,
}: CatalogSearchFieldProps) {
  const copy = catalogSearchCopy(locale);
  const [draft, setDraft] = useState(value);
  const onChangeRef = useRef(onChange);
  const lastPublishedRef = useRef(value);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (value === lastPublishedRef.current) return;
    lastPublishedRef.current = value;
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (draft === lastPublishedRef.current) return;
    const timeoutId = window.setTimeout(() => {
      lastPublishedRef.current = draft;
      onChangeRef.current(draft);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [draft]);

  function publish(next: string) {
    lastPublishedRef.current = next;
    setDraft(next);
    onChangeRef.current(next);
  }

  return (
    <div className="mb-6">
      <label className="sr-only">{copy.label}</label>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-900/5">
        <svg
          className="h-5 w-5 shrink-0 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
          />
        </svg>
        <input
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder || copy.placeholder}
          aria-label={copy.label}
          className="h-14 w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
        />
        {draft ? (
          <button
            type="button"
            onClick={() => publish("")}
            aria-label={copy.clear}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}

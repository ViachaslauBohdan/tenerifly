import type { ReactNode } from "react";

type CompactSearchFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
  hideLabel?: boolean;
};

export function CompactSearchField({
  label,
  children,
  className = "",
  hideLabel = false,
}: CompactSearchFieldProps) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col items-start justify-center px-3 sm:px-5 ${
        hideLabel ? "py-0" : "py-2 sm:py-[15px]"
      } ${className}`}
    >
      {hideLabel ? (
        <span className="sr-only">{label}</span>
      ) : (
        <span className="mb-1 truncate text-xs font-medium leading-none text-gray-500">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

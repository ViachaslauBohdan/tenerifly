"use client";

interface CatalogFilterMoreToggleProps {
  expanded: boolean;
  onToggle: () => void;
  showMoreLabel: string;
  showLessLabel: string;
  className?: string;
}

export function CatalogFilterMoreToggle({
  expanded,
  onToggle,
  showMoreLabel,
  showLessLabel,
  className,
}: CatalogFilterMoreToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={
        className ||
        "mb-4 w-full rounded-md border border-transparent px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      }
      aria-expanded={expanded}
    >
      {expanded ? showLessLabel : showMoreLabel}
    </button>
  );
}

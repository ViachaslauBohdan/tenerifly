"use client";

interface CatalogFilterMoreToggleProps {
  expanded: boolean;
  onToggle: () => void;
  showMoreLabel: string;
  showLessLabel: string;
}

export function CatalogFilterMoreToggle({
  expanded,
  onToggle,
  showMoreLabel,
  showLessLabel,
}: CatalogFilterMoreToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full mb-4 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      aria-expanded={expanded}
    >
      {expanded ? showLessLabel : showMoreLabel}
    </button>
  );
}

'use client';

import { FilterPanel, FilterConfig } from './FilterPanel';

interface FiltersSectionProps {
  config: FilterConfig[];
  initialValues: Record<string, string | null | [number, number]>;
}

export function FiltersSection({ config, initialValues }: FiltersSectionProps) {
  return (
    <aside>
      <FilterPanel
        config={config}
        values={initialValues}
        onChange={() => {}}
        onReset={() => {}}
      />
    </aside>
  );
} 
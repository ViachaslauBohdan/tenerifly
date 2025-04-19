'use client';

import { Card, Text, Select, RangeSlider, Button, Stack } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'range' | 'multiSelect';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

export interface FilterPanelProps {
  config: FilterConfig[];
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
  onReset: () => void;
}

export function FilterPanel({ config, values, onChange, onReset }: FilterPanelProps) {
  return (
    <Card withBorder>
      <Stack gap="md">
        <Text fw={500} size="lg">
          <IconFilter size="1rem" style={{ marginRight: '0.5rem' }} />
          Filters
        </Text>

        {config.map((filter) => (
          <div key={filter.id}>
            <Text size="sm" fw={500} mb="xs">
              {filter.label}
            </Text>

            {filter.type === 'select' && (
              <Select
                data={filter.options || []}
                value={values[filter.id]}
                onChange={(value) => onChange(filter.id, value)}
                clearable
                placeholder={`Select ${filter.label.toLowerCase()}`}
              />
            )}

            {filter.type === 'range' && (
              <RangeSlider
                min={filter.min}
                max={filter.max}
                step={filter.step}
                value={values[filter.id]}
                onChange={(value) => onChange(filter.id, value)}
                label={(value) => `€${value}`}
              />
            )}
          </div>
        ))}

        <Button variant="light" onClick={onReset}>
          Reset Filters
        </Button>
      </Stack>
    </Card>
  );
} 
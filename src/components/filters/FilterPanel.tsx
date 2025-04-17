'use client';

import { Card, Title, Text, RangeSlider, Select, MultiSelect, Button, Group, Stack } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  type: 'select' | 'multiSelect' | 'range';
  label: string;
  key: string;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

interface FilterPanelProps {
  title: string;
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
}

export function FilterPanel({ title, filters, values, onChange, onReset }: FilterPanelProps) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconFilter size={20} />
          <Title order={3}>{title}</Title>
        </Group>
        <Button variant="subtle" onClick={onReset}>
          Reset
        </Button>
      </Group>

      <Stack gap="md">
        {filters.map((filter) => (
          <div key={filter.key}>
            <Text size="sm" fw={500} mb="xs">
              {filter.label}
            </Text>

            {filter.type === 'select' && filter.options && (
              <Select
                value={values[filter.key] || ''}
                onChange={(value) => onChange(filter.key, value)}
                data={filter.options}
                clearable
              />
            )}

            {filter.type === 'multiSelect' && filter.options && (
              <MultiSelect
                value={values[filter.key] || []}
                onChange={(value) => onChange(filter.key, value)}
                data={filter.options}
                clearable
              />
            )}

            {filter.type === 'range' && filter.min !== undefined && filter.max !== undefined && (
              <RangeSlider
                value={values[filter.key] || [filter.min, filter.max]}
                onChange={(value) => onChange(filter.key, value)}
                min={filter.min}
                max={filter.max}
                step={filter.step || 1}
                label={(value) => `${value}`}
              />
            )}
          </div>
        ))}
      </Stack>
    </Card>
  );
} 
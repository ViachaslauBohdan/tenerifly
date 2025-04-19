'use client';

import { Box, RangeSlider, TextInput, NumberInput, Button, Stack, Group } from '@mantine/core';

interface FilterPanelProps {
  filters: {
    priceRange: [number, number];
    location: string;
    bedrooms: string;
    maxGuests: string;
  };
  onFilterChange: (key: string, value: any) => void;
  onReset: () => void;
}

export function FilterPanel({ filters, onFilterChange, onReset }: FilterPanelProps) {
  return (
    <Box>
      <Stack gap="md">
        <Box>
          <RangeSlider
            label="Price Range (€)"
            min={0}
            max={10000}
            step={100}
            value={filters.priceRange}
            onChange={(value) => onFilterChange('priceRange', value)}
            marks={[
              { value: 0, label: '€0' },
              { value: 5000, label: '€5000' },
              { value: 10000, label: '€10000' },
            ]}
          />
        </Box>

        <TextInput
          label="Location"
          placeholder="Enter city or address"
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.currentTarget.value)}
        />

        <NumberInput
          label="Bedrooms"
          placeholder="Number of bedrooms"
          value={filters.bedrooms === '' ? '' : parseInt(filters.bedrooms)}
          onChange={(value) => onFilterChange('bedrooms', value?.toString() || '')}
          min={0}
          max={10}
        />

        <NumberInput
          label="Max Guests"
          placeholder="Maximum number of guests"
          value={filters.maxGuests === '' ? '' : parseInt(filters.maxGuests)}
          onChange={(value) => onFilterChange('maxGuests', value?.toString() || '')}
          min={0}
          max={20}
        />

        <Group justify="flex-end">
          <Button variant="light" onClick={onReset}>
            Reset Filters
          </Button>
        </Group>
      </Stack>
    </Box>
  );
} 
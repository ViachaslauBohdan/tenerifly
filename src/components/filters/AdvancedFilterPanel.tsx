import { useState } from "react";
import {
  Box,
  Button,
  Group,
  Select,
  TextInput,
  RangeSlider,
  Switch,
  MultiSelect,
  Stack,
  Text,
  Collapse,
  Paper,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconFilter,
  IconFilterOff,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";

export interface FilterConfig {
  key: string;
  type: "select" | "multiselect" | "range" | "text" | "boolean" | "date";
  label: string;
  options?: { value: any; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface AdvancedFilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onClear: () => void;
}

export function AdvancedFilterPanel({
  filters,
  values,
  onChange,
  onClear,
}: AdvancedFilterPanelProps) {
  const [opened, setOpened] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    const newValues = { ...values };

    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete newValues[key];
    } else {
      newValues[key] = value;
    }

    onChange(newValues);
  };

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.key];

    switch (filter.type) {
      case "select":
        return (
          <Select
            key={filter.key}
            label={filter.label}
            placeholder={`Выберите ${filter.label.toLowerCase()}`}
            data={filter.options || []}
            value={value || null}
            onChange={(val) => handleFilterChange(filter.key, val)}
            clearable
          />
        );

      case "multiselect":
        return (
          <MultiSelect
            key={filter.key}
            label={filter.label}
            placeholder={`Выберите ${filter.label.toLowerCase()}`}
            data={filter.options || []}
            value={value || []}
            onChange={(val) => handleFilterChange(filter.key, val)}
            clearable
          />
        );

      case "range":
        const rangeValue: [number, number] =
          Array.isArray(value) && value.length === 2
            ? [value[0], value[1]]
            : [filter.min || 0, filter.max || 100];
        return (
          <Box key={filter.key}>
            <Text size="sm" fw={500} mb="xs">
              {filter.label}: {rangeValue[0]} - {rangeValue[1]}
            </Text>
            <RangeSlider
              min={filter.min || 0}
              max={filter.max || 100}
              step={filter.step || 1}
              value={rangeValue}
              onChange={(val) => handleFilterChange(filter.key, val)}
            />
          </Box>
        );

      case "text":
        return (
          <TextInput
            key={filter.key}
            label={filter.label}
            placeholder={
              filter.placeholder || `Введите ${filter.label.toLowerCase()}`
            }
            value={value || ""}
            onChange={(event) =>
              handleFilterChange(filter.key, event.currentTarget.value)
            }
          />
        );

      case "boolean":
        return (
          <Switch
            key={filter.key}
            label={filter.label}
            checked={Boolean(value)}
            onChange={(event) =>
              handleFilterChange(filter.key, event.currentTarget.checked)
            }
          />
        );

      case "date":
        return (
          <DateInput
            key={filter.key}
            label={filter.label}
            placeholder={`Выберите ${filter.label.toLowerCase()}`}
            value={value ? new Date(value) : null}
            onChange={(date) =>
              handleFilterChange(filter.key, date?.toISOString())
            }
            clearable
            dateParser={(input) => {
              const date = new Date(input);
              return isNaN(date.getTime()) ? null : date;
            }}
            valueFormat="DD/MM/YYYY"
          />
        );

      default:
        return null;
    }
  };

  const activeFiltersCount = Object.keys(values).length;

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="md">
        <Button
          variant="light"
          leftSection={<IconFilter size={16} />}
          rightSection={
            opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
          }
          onClick={() => setOpened(!opened)}
        >
          Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconFilterOff size={16} />}
            onClick={onClear}
          >
            Очистить
          </Button>
        )}
      </Group>

      <Collapse in={opened}>
        <Stack gap="md">{filters.map(renderFilter)}</Stack>
      </Collapse>
    </Paper>
  );
}

'use client';

import { useState } from 'react';
import { 
  Card, 
  Text, 
  Select, 
  MultiSelect, 
  RangeSlider, 
  Button, 
  Stack, 
  Group, 
  Checkbox, 
  NumberInput,
  Collapse,
  Divider,
  Box,
  Paper,
  rem
} from '@mantine/core';
import { IconFilter, IconChevronDown, IconRefresh, IconCheck } from '@tabler/icons-react';
import { FilterConfig } from '@/config/filters';
import { useTranslation } from '@/hooks/useTranslation';

export interface AdvancedFilterPanelProps {
  config: FilterConfig[];
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
  onReset: () => void;
  onApply: () => void;
  loading?: boolean;
}

export function AdvancedFilterPanel({ 
  config, 
  values, 
  onChange, 
  onReset, 
  onApply,
  loading = false 
}: AdvancedFilterPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { t, locale } = useTranslation();

  const basicFilters = config.filter(filter => filter.category === 'basic' || !filter.category);
  const advancedFilters = config.filter(filter => filter.category === 'advanced');
  const hasAdvancedFilters = advancedFilters.length > 0;

  // Проверяем наличие активных фильтров
  const hasActiveFilters = Object.values(values).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value !== '';
    if (typeof value === 'number') return true;
    return false;
  });

  // Функция для получения символа валюты по локали
  const getCurrencySymbol = () => {
    const symbols = {
      en: '€',
      pl: 'zł', 
      fr: '€',
      ru: '₽',
      uk: '$'
    };
    return symbols[locale] || '€';
  };

  // Функция для форматирования меток на слайдере цен
  const formatPriceLabel = (value: number) => {
    return `${getCurrencySymbol()}${value}`;
  };

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.id];
    
    // Специальная логика для range слайдеров
    let rangeValue = value;
    if (filter.type === 'range' && !value) {
      rangeValue = [filter.min || 1, filter.max || 100];
    }

    switch (filter.type) {
      case 'select':
        return (
          <Box key={filter.id}>
            <Text size="sm" fw={600} mb="xs" c="gray.8">
              {filter.label}
            </Text>
            <Select
              placeholder={filter.placeholder || `Выберите ${filter.label.toLowerCase()}`}
              data={filter.options || []}
              value={value || null}
              onChange={(val) => onChange(filter.id, val)}
              clearable
              size="md"
              radius="md"
              styles={{
                input: {
                  backgroundColor: '#f9fafb',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  fontSize: rem(14),
                  padding: `${rem(12)} ${rem(16)}`,
                  '&:focus': {
                    borderColor: '#3b82f6',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  },
                  '&::placeholder': {
                    color: '#9ca3af'
                  }
                },
                dropdown: {
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: rem(12),
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                },
                option: {
                  padding: `${rem(12)} ${rem(16)}`,
                  fontSize: rem(14),
                  color: '#374151',
                  borderRadius: 0,
                  '&[data-selected]': {
                    backgroundColor: '#dbeafe !important',
                    color: '#1e40af !important',
                    fontWeight: 500
                  },
                  '&:hover': {
                    backgroundColor: '#f3f4f6 !important'
                  }
                }
              }}
            />
          </Box>
        );

      case 'multiselect':
        return (
          <Box key={filter.id}>
            <Text size="sm" fw={600} mb="xs" c="gray.8">
              {filter.label}
            </Text>
            <MultiSelect
              placeholder={filter.placeholder || `Выберите ${filter.label.toLowerCase()}`}
              data={filter.options || []}
              value={value || []}
              onChange={(val) => onChange(filter.id, val)}
              clearable
              searchable
              size="md"
              radius="md"
              maxDropdownHeight={280}
              styles={{
                input: {
                  backgroundColor: '#f9fafb',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  fontSize: rem(14),
                  minHeight: rem(44),
                  '&:focus': {
                    borderColor: '#3b82f6',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  }
                },
                dropdown: {
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: rem(12),
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                },
                option: {
                  padding: `${rem(10)} ${rem(14)}`,
                  fontSize: rem(13),
                  color: '#374151',
                  lineHeight: '1.4',
                  '&[data-selected]': {
                    backgroundColor: '#dbeafe !important',
                    color: '#1e40af !important'
                  },
                  '&:hover': {
                    backgroundColor: '#f3f4f6 !important'
                  }
                }
              }}
            />
          </Box>
        );

      case 'range':
        // Создаем метки с правильной валютой
        const marks = filter.marks?.map(mark => ({
          value: mark.value,
          label: formatPriceLabel(mark.value)
        })) || [];

        return (
          <Box key={filter.id}>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={600} c="gray.8">
                {filter.label}
              </Text>
              <Text size="xs" c="gray.6">
                {value ? `${formatPriceLabel(value[0])} - ${formatPriceLabel(value[1])}` : `${formatPriceLabel(filter.min || 0)} - ${formatPriceLabel(filter.max || 100)}`}
              </Text>
            </Group>
            <Box px="md" py="lg">
              <RangeSlider
                value={rangeValue}
                onChange={(val) => onChange(filter.id, val)}
                min={filter.min || 1}
                max={filter.max || 100}
                step={filter.step || 1}
                marks={marks}
                size="md"
                radius="xl"
                color="blue"
              />
            </Box>
          </Box>
        );

      case 'checkbox':
        return (
          <Box key={filter.id}>
            <Checkbox
              label={filter.label}
              checked={!!value}
              onChange={(event) => onChange(filter.id, event.currentTarget.checked)}
              size="md"
              color="blue"
              styles={{
                root: {
                  padding: rem(8)
                },
                label: {
                  fontSize: rem(14),
                  color: '#374151',
                  fontWeight: 500,
                  cursor: 'pointer'
                },
                input: {
                  cursor: 'pointer',
                  '&:checked': {
                    backgroundColor: '#3b82f6',
                    borderColor: '#3b82f6'
                  }
                }
              }}
            />
          </Box>
        );

      case 'number':
        return (
          <Box key={filter.id}>
            <Text size="sm" fw={600} mb="xs" c="gray.8">
              {filter.label}
            </Text>
            <NumberInput
              placeholder={filter.placeholder || `Введите ${filter.label.toLowerCase()}`}
              value={value || ''}
              onChange={(val) => onChange(filter.id, val)}
              min={filter.min}
              max={filter.max}
              step={filter.step}
              size="md"
              radius="md"
              styles={{
                input: {
                  backgroundColor: '#f9fafb',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  fontSize: rem(14),
                  '&:focus': {
                    borderColor: '#3b82f6',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  }
                }
              }}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box pos="sticky" style={{ top: rem(20) }}>
      <Card 
        withBorder 
        radius="xl" 
        shadow="md"
        padding="xl"
        styles={{
          root: {
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <Stack gap="xl">
          {/* Заголовок */}
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <Box
                style={{
                  background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                  borderRadius: rem(12),
                  padding: rem(12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <IconFilter size={20} color="white" />
              </Box>
              <Text fw={700} size="xl" c="gray.9">Фильтры</Text>
            </Group>
            {hasActiveFilters && (
              <Button
                variant="light"
                size="sm"
                color="gray"
                onClick={onReset}
                leftSection={<IconRefresh size={16} />}
                radius="xl"
                styles={{
                  root: {
                    backgroundColor: '#f8f9fa',
                    color: '#6b7280',
                    '&:hover': {
                      backgroundColor: '#f1f3f4'
                    }
                  }
                }}
              >
                Сбросить
              </Button>
            )}
          </Group>

          {/* Основные фильтры */}
          <Stack gap="lg">
            {basicFilters.map(renderFilter)}
          </Stack>

          {/* Дополнительные фильтры */}
          {hasAdvancedFilters && (
            <>
              <Divider 
                color="gray.2"
              />
              <Button
                variant="subtle"
                onClick={() => setShowAdvanced(!showAdvanced)}
                rightSection={
                  <IconChevronDown 
                    size={18} 
                    style={{ 
                      transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                }
                fullWidth
                justify="space-between"
                color="blue"
                size="lg"
                radius="lg"
                styles={{
                  root: {
                    padding: `${rem(14)} ${rem(20)}`,
                    backgroundColor: '#f8f9fa',
                    color: '#6b7280',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#f1f3f4'
                    }
                  }
                }}
              >
                Дополнительные фильтры
              </Button>
              
              <Collapse in={showAdvanced}>
                <Stack gap="lg" mt="md">
                  {advancedFilters.map(renderFilter)}
                </Stack>
              </Collapse>
            </>
          )}

          <Divider 
            color="gray.2"
          />

          {/* Кнопка применения */}
          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
            onClick={onApply}
            loading={loading}
            leftSection={<IconCheck size={18} />}
            fullWidth
            size="lg"
            radius="xl"
            styles={{
              root: {
                padding: `${rem(16)} ${rem(24)}`,
                fontSize: rem(16),
                fontWeight: 700,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
                },
                transition: 'all 0.2s ease'
              }
            }}
          >
            Применить фильтры
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
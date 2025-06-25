'use client';

import { Select } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import { useTranslation } from '@/hooks/useTranslation';

export function LanguageSwitcher() {
  const { locale, locales, switchLocale } = useTranslation();

  const languageOptions = locales.map((loc) => ({
    value: loc.code,
    label: `${loc.flag} ${loc.name}`,
  }));

  return (
    <Select
      value={locale}
      onChange={(value) => value && switchLocale(value as any)}
      data={languageOptions}
      leftSection={<IconLanguage size={20} />}
      variant="filled"
      size="sm"
      w={160}
      styles={{
        input: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#000',
          fontWeight: 500,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          }
        },
        dropdown: {
          backgroundColor: 'white',
          border: '1px solid #e9ecef',
        },
        option: {
          color: '#000',
          '&[data-selected]': {
            backgroundColor: '#228be6',
            color: 'white',
          },
          '&:hover': {
            backgroundColor: '#f8f9fa',
          }
        }
      }}
    />
  );
}
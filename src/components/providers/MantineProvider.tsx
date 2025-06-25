'use client';

import { MantineProvider as BaseMantineProvider, createTheme, rem } from '@mantine/core';
import { ReactNode } from 'react';

const theme = createTheme({
  // Цветовая палитра
  colors: {
    blue: [
      '#e3f2fd',
      '#bbdefb',
      '#90caf9',
      '#64b5f6',
      '#42a5f5',
      '#2196f3',
      '#1e88e5',
      '#1976d2',
      '#1565c0',
      '#0d47a1'
    ],
    cyan: [
      '#e0f7fa',
      '#b2ebf2',
      '#80deea',
      '#4dd0e1',
      '#26c6da',
      '#00bcd4',
      '#00acc1',
      '#0097a7',
      '#00838f',
      '#006064'
    ],
    gray: [
      '#f8f9fa',
      '#f1f3f4',
      '#e8eaed',
      '#dadce0',
      '#bdc1c6',
      '#9aa0a6',
      '#80868b',
      '#5f6368',
      '#3c4043',
      '#202124'
    ]
  },

  // Основной цвет
  primaryColor: 'blue',

  // Шрифты
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '900',
    sizes: {
      h1: { fontSize: rem(48), lineHeight: '1.2' },
      h2: { fontSize: rem(36), lineHeight: '1.3' },
      h3: { fontSize: rem(28), lineHeight: '1.4' },
      h4: { fontSize: rem(24), lineHeight: '1.4' },
      h5: { fontSize: rem(20), lineHeight: '1.5' },
      h6: { fontSize: rem(18), lineHeight: '1.5' },
    },
  },

  // Размеры
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },

  // Радиусы
  radius: {
    xs: rem(4),
    sm: rem(6),
    md: rem(8),
    lg: rem(12),
    xl: rem(20),
  },

  // Тени
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  },

  // Отступы
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },

  // Кастомные компоненты
  components: {
    Button: {
      defaultProps: {
        radius: 'lg',
      },
    },

    Card: {
      defaultProps: {
        radius: 'xl',
        shadow: 'md',
        withBorder: true,
      },
    },

    Paper: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
      },
    },

    Input: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },

    Select: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },

    MultiSelect: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },

    Container: {
      defaultProps: {
        size: 'xl',
      },
    },

    Alert: {
      defaultProps: {
        radius: 'lg',
      },
    },
  },
});

interface MantineProviderProps {
  children: ReactNode;
}

export function MantineProvider({ children }: MantineProviderProps) {
  return (
    <BaseMantineProvider theme={theme}>
      {children}
    </BaseMantineProvider>
  );
}
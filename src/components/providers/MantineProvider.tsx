'use client';

import { MantineProvider as MantineProviderBase } from '@mantine/core';
import { ReactNode } from 'react';

interface MantineProviderProps {
  children: ReactNode;
}

export function MantineProvider({ children }: MantineProviderProps) {
  return (
    <MantineProviderBase defaultColorScheme="light">
      {children}
    </MantineProviderBase>
  );
} 
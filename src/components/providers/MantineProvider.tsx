'use client';

import { MantineProvider as MantineProviderBase, createTheme } from '@mantine/core';
import { ReactNode } from 'react';

const theme = createTheme({
  primaryColor: 'blue',
  // Add any theme customizations here
});

interface MantineProviderProps {
  children: ReactNode;
}

export function MantineProvider({ children }: MantineProviderProps) {
  return (
    <MantineProviderBase theme={theme} defaultColorScheme="light">
      {children}
    </MantineProviderBase>
  );
} 
'use client';

import React from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import { openWhatsApp } from '@/utils/whatsapp';

export function WhatsAppButton() {
  const handleClick = () => {
    openWhatsApp('general', { title: 'Tenerifly Services' });
  };

  return (
    <Tooltip label="Contact us on WhatsApp">
      <ActionIcon
        variant="filled"
        color="green"
        size="xl"
        radius="xl"
        onClick={handleClick}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          zIndex: 1000,
          width: 60,
          height: 60,
          backgroundColor: '#25D366',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
      >
        <IconBrandWhatsapp size={32} />
      </ActionIcon>
    </Tooltip>
  );
} 
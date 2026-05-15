'use client';

import React from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import { openWhatsApp } from '@/utils/whatsapp';
import { useTranslation } from '@/hooks/useTranslation';

export function WhatsAppButton() {
  const { locale, t } = useTranslation();
  
  const handleClick = () => {
    openWhatsApp('general', { title: 'Tenerifly Services' }, locale);
  };

  return (
    <Tooltip label={locale === 'en' ? "Contact us on WhatsApp" : 
                   locale === 'pl' ? "Skontaktuj się z nami przez WhatsApp" :
                   locale === 'fr' ? "Contactez-nous sur WhatsApp" :
                   locale === 'ru' ? "Свяжитесь с нами в WhatsApp" :
                   locale === 'ua' ? "Зв'яжіться з нами в WhatsApp" :
                   locale === 'de' ? "Kontaktieren Sie uns über WhatsApp" :
                   locale === 'es' ? "Contáctenos por WhatsApp" : "Contact us on WhatsApp"}>
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
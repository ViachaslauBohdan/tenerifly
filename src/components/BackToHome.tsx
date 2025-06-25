'use client';

import { Group, Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export function BackToHome() {
  const router = useRouter();
  const { locale, t } = useTranslation();

  return (
    <Group justify="flex-start" mb="md">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.push(`/${locale}`)}
      >
        {t.common.backToHome}
      </Button>
    </Group>
  );
}
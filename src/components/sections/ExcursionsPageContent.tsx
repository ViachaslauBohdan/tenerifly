'use client';

import { Container, Grid, Title, Text } from '@mantine/core';
import { AdvancedFilterPanel } from '@/components/filters/AdvancedFilterPanel';
import { ExcursionsGrid } from '@/components/sections/ExcursionsGrid';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { Tour } from '@/types/strapi';
import { excursionFilters } from '@/config/filters';

interface ExcursionsPageContentProps {
  tours: Tour[];
}

export function ExcursionsPageContent({ tours }: ExcursionsPageContentProps) {
  const { t } = useTranslation();

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      <header>
        <Title order={1} mb="xl" ta="center">
          {t.sections.excursions.title}
        </Title>
        <Text size="lg" mb="xl" ta="center" c="dimmed">
          {t.sections.excursions.subtitle}
        </Text>
      </header>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <AdvancedFilterPanel
            config={excursionFilters}
            values={{}}
            onChange={(id, value) => console.log('Filter changed:', id, value)}
            onReset={() => console.log('Reset filters')}
            onApply={() => console.log('Apply filters')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <ExcursionsGrid tours={tours} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
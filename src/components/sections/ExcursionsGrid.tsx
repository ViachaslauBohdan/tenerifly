'use client';

import { Grid, Text } from '@mantine/core';
import { ExcursionTile } from '@/components/tiles/ExcursionTile';
import { Tour } from '@/types/strapi';
import { adaptStrapiPrice } from '@/utils/typeAdapters';
import { useTranslation } from '@/hooks/useTranslation';

interface ExcursionsGridProps {
  tours: Tour[];
}

export function ExcursionsGrid({ tours }: ExcursionsGridProps) {
  const { locale } = useTranslation();

  return (
    <>
      {tours.length === 0 ? (
        <Text ta="center" py="xl">No excursions found</Text>
      ) : (
        <section aria-label="Excursion listings">
          <Grid>
            {tours.map((tour) => (
              <Grid.Col key={tour.id} span={{ base: 12, sm: 6 }}>
                <article>
                  <ExcursionTile
                    id={tour.id} 
                    title={tour.title}
                    description={tour.description}
                    image={tour.images?.[0]?.url || '/placeholder.jpg'}
                    duration={tour.duration}
                    price={`€${tour.price?.amount || 0}`}
                    language={tour.language || 'EN'}
                    onView={() => console.log('View tour:', tour.id)}
                    currentLocale={locale}
                    strapiPrice={tour.price ? adaptStrapiPrice(tour.price) : null}
                  />
                </article>
              </Grid.Col>
            ))}
          </Grid>
        </section>
      )}
    </>
  );
}
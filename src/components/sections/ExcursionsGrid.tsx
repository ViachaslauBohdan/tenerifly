'use client';

import { Grid, Text } from '@mantine/core';
import { ExcursionTile } from '@/components/tiles/ExcursionTile';
import { Tour } from '@/types/strapi';

interface ExcursionsGridProps {
  tours: Tour[];
}

export function ExcursionsGrid({ tours }: ExcursionsGridProps) {
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
                    title={tour.title}
                    description={tour.description}
                    image={tour.images?.[0]?.url || '/placeholder.jpg'}
                    duration={tour.duration}
                    price={`€${tour.price?.amount || 0}${tour.price?.period === 'day' ? '/day' : ''}`}
                    language={tour.language}
                    onView={() => console.log('View excursion:', tour.id)}
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
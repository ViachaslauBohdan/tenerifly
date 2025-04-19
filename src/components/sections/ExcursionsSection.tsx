'use client';

import { Grid, Text } from '@mantine/core';
import { ExcursionTile } from '@/components/tiles';

interface ExcursionsSectionProps {
  tours: Array<{
    id: number;
    title: string;
    description: string;
    images: Array<{ url: string }>;
    duration: string;
    price: { amount: number };
    language: 'RU' | 'EN' | 'ES';
  }>;
}

export function ExcursionsSection({ tours }: ExcursionsSectionProps) {
  return (
    <>
      {tours.length === 0 ? (
        <Text ta="center" py="xl">No tours found</Text>
      ) : (
        <section aria-label="Tour listings">
          <Grid>
            {tours.map((tour) => (
              <Grid.Col key={tour.id} span={{ base: 12, sm: 6 }}>
                <article>
                  <ExcursionTile
                    title={tour.title}
                    description={tour.description}
                    image={tour.images?.[0]?.url || '/placeholder.jpg'}
                    duration={tour.duration}
                    price={`€${tour.price?.amount || 0}`}
                    language={tour.language || 'EN'}
                    onView={() => console.log('View tour:', tour.id)}
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
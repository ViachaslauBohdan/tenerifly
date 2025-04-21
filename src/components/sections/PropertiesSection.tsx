'use client';

import { Container, Grid, Title, Text } from '@mantine/core';
import { PropertyTile } from '@/components/tiles/PropertyTile';
import { Property } from '@/types/strapi';

interface PropertiesSectionProps {
  properties: Property[];
}

export function PropertiesSection({ properties }: PropertiesSectionProps) {
  return (
    <Container size="xl" py="xl">
      <header>
        <Title order={2} mb="xl">Featured Properties</Title>
        <Text size="lg" mb="xl">
          Discover our selection of premium properties in Tenerife. From cozy apartments to luxury villas, find your perfect home.
        </Text>
      </header>

      <Grid>
        {properties.map((property) => (
          <Grid.Col key={property.id} span={{ base: 12, sm: 6, md: 4 }}>
            <PropertyTile
              key={property.id}
              property={property}
              onBook={(id) => console.log('Book property:', id)}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
} 
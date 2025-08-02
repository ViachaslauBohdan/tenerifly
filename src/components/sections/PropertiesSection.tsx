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
              id={property.id.toString()}
              title={property.title}
              description={property.description || 'Описание отсутствует'}
              image={property.images?.[0]?.url || '/placeholder.jpg'}
              type={property.type}
              price={`€${property.price?.amount || 0}`}
              specifications={{
                property_type: property.category || 'apartment',
                bedrooms: property.specifications?.bedrooms || 0,
                bathrooms: property.specifications?.bathrooms || 0,
                total_area: property.specifications?.total_area || 0,
                floor: property.specifications?.floor || 0,
                year_built: property.specifications?.year_built || 0,
              }}
              location={property.location?.city || ''}
              features={{
                has_balcony: true,
                has_terrace: property.features?.has_terrace || false,
                has_garden: property.features?.has_garden || false,
                has_pool: property.features?.has_pool || false,
                has_parking: property.features?.has_garage || false,
                furnished: property.specifications?.furnished || false,
              }}
              onContact={(id: string) => console.log('Связаться по недвижимости:', id)}
              currentLocale="ru"
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
} 

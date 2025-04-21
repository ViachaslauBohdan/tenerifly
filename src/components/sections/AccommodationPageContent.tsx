'use client';

import { Container, Grid, Title, Text } from '@mantine/core';
import { FilterConfig } from '@/components/filters/FilterPanel';
import { FiltersSection } from '@/components/filters/FiltersSection';
import { PropertyTile } from '@/components/tiles/PropertyTile';
import { BackToHome } from '@/components/BackToHome';
import { Property } from '@/types/strapi';

const propertyFilters: FilterConfig[] = [
  {
    id: 'priceRange',
    type: 'range',
    label: 'Price Range',
    min: 0,
    max: 200,
    step: 5,
  },
  {
    id: 'type',
    type: 'select',
    label: 'Type',
    options: [
      { value: 'rent', label: 'For Rent' },
      { value: 'sale', label: 'For Sale' },
    ],
  },
  {
    id: 'status',
    type: 'select',
    label: 'Status',
    options: [
      { value: 'available', label: 'Available' },
      { value: 'reserved', label: 'Reserved' },
      { value: 'sold', label: 'Sold' },
      { value: 'under_contract', label: 'Under Contract' },
    ],
  },
  {
    id: 'category',
    type: 'select',
    label: 'Category',
    options: [
      { value: 'apartment', label: 'Apartment' },
      { value: 'house', label: 'House' },
      { value: 'villa', label: 'Villa' },
      { value: 'penthouse', label: 'Penthouse' },
      { value: 'studio', label: 'Studio' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'land', label: 'Land' },
      { value: 'building', label: 'Building' },
    ],
  },
];

interface AccommodationPageContentProps {
  properties: Property[];
}

export function AccommodationPageContent({ properties }: AccommodationPageContentProps) {
  return (
    <Container size="xl" py="xl">
      <BackToHome />
      <header>
        <Title order={1} mb="xl">Accommodation in Tenerife</Title>
        <Text size="lg" mb="xl">
          Find your perfect place to stay in Tenerife. From cozy apartments to luxury villas, we have a wide selection of properties to choose from.
        </Text>
      </header>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <FiltersSection
            config={propertyFilters}
            initialValues={{
              priceRange: [0, 200],
              type: '',
              status: '',
              category: '',
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          {properties.length === 0 ? (
            <Text ta="center" py="xl">No properties found</Text>
          ) : (
            <section aria-label="Property listings">
              <Grid>
                {properties.map((property) => (
                  <Grid.Col key={property.id} span={{ base: 12, sm: 6 }}>
                    <article>
                      <PropertyTile
                        key={property.id}
                        property={property}
                        onBook={(id) => console.log('Book property:', id)}
                      />
                    </article>
                  </Grid.Col>
                ))}
              </Grid>
            </section>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
} 
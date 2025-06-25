'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, LoadingOverlay } from '@mantine/core';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { PropertyTile } from '@/components/tiles/PropertyTile';
import { BackToHome } from '@/components/BackToHome';
import { propertiesAPI } from '@/services/api';
import { Property } from '@/types/strapi';


const propertyFilters: FilterConfig[] = [
  {
    id: 'priceRange',
    type: 'range',
    label: 'Price Range',
    min: 0,
    max: 500000,
    step: 10000,
  },
  {
    id: 'type',
    type: 'select',
    label: 'Type',
    options: [
      { value: 'sale', label: 'For Sale' },
      { value: 'rent', label: 'For Rent' },
    ],
  },
  {
    id: 'bedrooms',
    type: 'select',
    label: 'Bedrooms',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4+', label: '4+' },
    ],
  },
  {
    id: 'location',
    type: 'select',
    label: 'Location',
    options: [
      { value: 'Costa Adeje', label: 'Costa Adeje' },
      { value: 'Los Cristianos', label: 'Los Cristianos' },
      { value: 'Playa de las Americas', label: 'Playa de las Americas' },
    ],
  },
];

export default function AccommodationPage() {
  const [filters, setFilters] = useState<Record<string, any>>({
    priceRange: [0, 500000],
    type: '',
    bedrooms: '',
    location: '',
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesAPI.getAll();
      setProperties(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFilterChange = (id: string, value: any) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleFilterReset = () => {
    setFilters({
      priceRange: [0, 500000],
      type: '',
      bedrooms: '',
      location: '',
    });
  };

  // Apply filters to properties
  const filteredProperties = properties.filter((property) => {
    // Price filter
    if (filters.priceRange && property.price.amount > filters.priceRange[1]) {
      return false;
    }

    // Type filter
    if (filters.type && property.type !== filters.type) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms && property.specifications.bedrooms.toString() !== filters.bedrooms) {
      return false;
    }

    // Location filter
    if (filters.location && property.location.city !== filters.location) {
      return false;
    }

    return true;
  });

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      <Title order={1} mb="xl">Properties in Tenerife</Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <FilterPanel
            config={propertyFilters}
            values={filters}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          {error ? (
            <Text c="red" ta="center" py="xl">{error}</Text>
          ) : (
            <Grid>
              {filteredProperties.length === 0 ? (
                <Grid.Col>
                  <Text ta="center" py="xl">No properties found</Text>
                </Grid.Col>
              ) : (
                filteredProperties.map((property) => (
                  <Grid.Col key={property.id} span={{ base: 12, sm: 6 }}>
                    <PropertyTile
                      property={property}
                      onBook={(id) => console.log('Book property:', id)}
                    />
                  </Grid.Col>
                ))
              )}
            </Grid>
          )}
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        </Grid.Col>
      </Grid>
    </Container>
  );
} 
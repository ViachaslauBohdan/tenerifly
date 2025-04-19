'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, LoadingOverlay } from '@mantine/core';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { PropertyTile } from '@/components/tiles/PropertyTile';
import { BackToHome } from '@/components/BackToHome';
import { propertiesAPI } from '@/services/api';
import { Property } from '@/types/property';

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
      console.log('API Response:', response);
      
      // Transform the API response to match our Property type
      const transformedProperties = response.data.map((item: any) => ({
        id: item.id,
        attributes: {
          title: item.title,
          description: item.description,
          type: item.type,
          property_status: item.property_status,
          featured: item.featured,
          category: item.category,
          price: {
            amount: item.price?.amount || 0,
            currency: item.price?.currency || 'EUR',
            period: item.price?.period || 'total',
          },
          specifications: {
            total_area: item.specifications?.total_area || 0,
            living_area: item.specifications?.living_area || 0,
            bedrooms: item.specifications?.bedrooms || 0,
            bathrooms: item.specifications?.bathrooms || 0,
            floor: item.specifications?.floor || 0,
            total_floors: item.specifications?.total_floors || 0,
            year_built: item.specifications?.year_built || null,
            parking_spaces: item.specifications?.parking_spaces || 0,
          },
          features: {
            has_pool: item.features?.has_pool || false,
            has_garden: item.features?.has_garden || false,
            has_garage: item.features?.has_garage || false,
            has_terrace: item.features?.has_terrace || false,
            has_security: item.features?.has_security || false,
            has_air_conditioning: item.features?.has_air_conditioning || false,
            has_heating: item.features?.has_heating || false,
            has_internet: item.features?.has_internet || false,
            furnished: item.features?.furnished || false,
            additional_features: item.features?.additional_features || null,
          },
          location: {
            address: item.location?.address || '',
            city: item.location?.city || '',
            region: item.location?.region || '',
            postal_code: item.location?.postal_code || '',
            latitude: item.location?.latitude || null,
            longitude: item.location?.longitude || null,
          },
          contact: {
            name: item.contact?.name || '',
            email: item.contact?.email || '',
            phone: item.contact?.phone || '',
            whatsapp: item.contact?.whatsapp || null,
            telegram: item.contact?.telegram || null,
            preferred_contact: item.contact?.preferred_contact || 'email',
          },
          images: item.images?.map((img: any) => ({
            url: img.url,
            formats: {
              thumbnail: { url: img.formats?.thumbnail?.url || '' },
              small: { url: img.formats?.small?.url || '' },
              medium: { url: img.formats?.medium?.url || '' },
              large: { url: img.formats?.large?.url || '' },
            },
          })) || [],
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt,
        },
      }));
      
      setProperties(transformedProperties);
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
    if (filters.priceRange && property.attributes.price.amount > filters.priceRange[1]) {
      return false;
    }

    // Type filter
    if (filters.type && property.attributes.type !== filters.type) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms && property.attributes.specifications.bedrooms.toString() !== filters.bedrooms) {
      return false;
    }

    // Location filter
    if (filters.location && property.attributes.location.city !== filters.location) {
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
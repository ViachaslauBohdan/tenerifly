'use client';

import { useState } from 'react';
import { Container, Grid, Title, Text } from '@mantine/core';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { AccommodationTile } from '@/components/tiles';
import { BackToHome } from '@/components/BackToHome';
import { Accommodation } from '@/types/strapi';

const accommodationFilters: FilterConfig[] = [
  {
    type: 'range',
    label: 'Price Range',
    key: 'price',
    min: 0,
    max: 1000,
    step: 10,
  },
  {
    type: 'select',
    label: 'Location',
    key: 'location',
    options: [
      { value: 'costa-adeje', label: 'Costa Adeje' },
      { value: 'playa-de-las-americas', label: 'Playa de las Americas' },
      { value: 'los-cristianos', label: 'Los Cristianos' },
    ],
  },
  {
    type: 'range',
    label: 'Bedrooms',
    key: 'bedrooms',
    min: 1,
    max: 5,
    step: 1,
  },
  {
    type: 'range',
    label: 'Bathrooms',
    key: 'bathrooms',
    min: 1,
    max: 4,
    step: 1,
  },
];

const mockImages = {
  data: {
    attributes: {
      url: "/placeholder.jpg",
      formats: {
        thumbnail: { url: "/placeholder-thumb.jpg" },
        small: { url: "/placeholder-small.jpg" },
        medium: { url: "/placeholder-medium.jpg" },
        large: { url: "/placeholder-large.jpg" }
      }
    }
  }
};

export default function AccommodationPage() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [accommodations, setAccommodations] = useState<Accommodation[]>([
    {
      id: 1,
      attributes: {
        title: "Beachfront Apartment",
        description: "Modern apartment with ocean views",
        images: [mockImages],
        location: "Los Cristianos",
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        amenities: "WiFi, Pool, Kitchen",
        price: 80,
        rating: 4.6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: 2,
      attributes: {
        title: "Mountain Villa",
        description: "Spacious villa with mountain views",
        images: [mockImages],
        location: "La Orotava",
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        amenities: "WiFi, Garden, Parking",
        price: 150,
        rating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    {
      id: 3,
      attributes: {
        title: "City Studio",
        description: "Cozy studio in the heart of the city",
        images: [mockImages],
        location: "Santa Cruz",
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        amenities: "WiFi, Kitchen",
        price: 60,
        rating: 4.4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      <Title order={1} mb="xl">Accommodation in Tenerife</Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <FilterPanel
            title="Filters"
            filters={accommodationFilters}
            values={filters}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 9 }}>
          <Grid>
            {accommodations.map((accommodation) => (
              <Grid.Col key={accommodation.id} span={{ base: 12, sm: 6, lg: 4 }}>
                <AccommodationTile
                  title={accommodation.attributes.title}
                  description={accommodation.attributes.description}
                  image={accommodation.attributes.images[0]?.data.attributes.url || '/placeholder.jpg'}
                  location={accommodation.attributes.location}
                  bedrooms={accommodation.attributes.bedrooms}
                  bathrooms={accommodation.attributes.bathrooms}
                  maxGuests={accommodation.attributes.maxGuests}
                  amenities={accommodation.attributes.amenities}
                  price={`€${accommodation.attributes.price}`}
                  rating={accommodation.attributes.rating}
                  onView={() => console.log('View accommodation:', accommodation.id)}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
      </Grid>
    </Container>
  );
} 
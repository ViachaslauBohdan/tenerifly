'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, LoadingOverlay } from '@mantine/core';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { PropertyTile } from '@/components/tiles/PropertyTile';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/types/locale';
import { Property } from '@/types/strapi';

const propertyFilters: FilterConfig[] = [
  {
    id: 'priceRange',
    type: 'range',
    label: 'Price Range',
    min: 0,
    max: 200,
    step: 10,
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

const mockProperties: Property[] = [
  {
    id: 1,
    title: "Beachfront Apartment",
    slug: "beachfront-apartment",
    description: "Modern apartment with ocean views",
    images: [{ 
      id: 1, 
      url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236816/olivia_0bd8b39b42.jpg",
      formats: {
        thumbnail: {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236816/olivia_0bd8b39b42.jpg",
          width: 150,
          height: 150
        }
      }
    }],
    type: 'rent',
    property_status: 'available',
    featured: true,
    category: 'apartment',
    price: {
      id: 1,
      amount: 70,
      currency: 'EUR',
      period: 'day'
    },
    specifications: {
      id: 1,
      total_area: 85,
      living_area: 70,
      bedrooms: 2,
      bathrooms: 1,
      floor: 1,
      total_floors: 3,
      year_built: 2015,
      parking_spaces: 1,
      furnished: true
    },
    features: {
      id: 1,
      air_conditioning: true,
      heating: false,
      internet: true,
      tv: true,
      washing_machine: true,
      dishwasher: false,
      pool: true,
      garden: false,
      terrace: true,
      garage: false,
      elevator: true,
      security: false,
      additional_features: ['WiFi', 'Ocean View', 'Balcony']
    },
    rental_terms: {
      id: 1,
      min_rental_period: 3,
      deposit_amount: 200,
      pets_allowed: false,
      smoking_allowed: false,
      utilities_included: true,
      additional_terms: ['Check-in after 15:00', 'Check-out before 11:00']
    },
    location: {
      id: 1,
      address: "Los Gigantes, Tenerife",
      city: "Los Gigantes",
      region: "Tenerife",
      postal_code: "38683",
      latitude: 28.2393,
      longitude: -16.8416
    },
    contact: {
      id: 1,
      name: "Tenerifly",
      email: "accommodation@tenerifly.io",
      phone: "+34656641433",
      whatsapp: "+34656641433",
      telegram: null,
      preferred_contact: "whatsapp"
    },
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    publishedAt: "2025-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    title: "Mountain Villa",
    slug: "mountain-villa",
    description: "Spacious villa with mountain views",
    images: [{ 
      id: 2, 
      url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745237011/olivia3_f4dcd69705.jpg",
      formats: {
        thumbnail: {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745237011/olivia3_f4dcd69705.jpg",
          width: 150,
          height: 150
        }
      }
    }],
    type: 'rent',
    property_status: 'available',
    featured: false,
    category: 'villa',
    price: {
      id: 2,
      amount: 120,
      currency: 'EUR',
      period: 'day'
    },
    specifications: {
      id: 2,
      total_area: 150,
      living_area: 120,
      bedrooms: 3,
      bathrooms: 2,
      floor: 0,
      total_floors: 2,
      year_built: 2010,
      parking_spaces: 2,
      furnished: true
    },
    features: {
      id: 2,
      air_conditioning: true,
      heating: true,
      internet: true,
      tv: true,
      washing_machine: true,
      dishwasher: true,
      pool: false,
      garden: true,
      terrace: true,
      garage: true,
      elevator: false,
      security: true,
      additional_features: ['Mountain View', 'BBQ Area', 'Private Garden']
    },
    rental_terms: {
      id: 2,
      min_rental_period: 7,
      deposit_amount: 400,
      pets_allowed: true,
      smoking_allowed: false,
      utilities_included: true,
      additional_terms: ['Weekly cleaning included', 'Garden maintenance included']
    },
    location: {
      id: 2,
      address: "Los Cristianos, Tenerife",
      city: "Los Cristianos",
      region: "Tenerife",
      postal_code: "38650",
      latitude: 28.0515,
      longitude: -16.7137
    },
    contact: {
      id: 2,
      name: "Tenerifly",
      email: "accommodation@tenerifly.io",
      phone: "+34656641433",
      whatsapp: "+34656641433",
      telegram: null,
      preferred_contact: "whatsapp"
    },
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    publishedAt: "2025-01-01T00:00:00.000Z"
  },
  {
    id: 3,
    title: "City Studio",
    slug: "city-studio",
    description: "Cozy studio in the heart of the city",
    images: [{ 
      id: 3, 
      url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236495/c8293dae_fe52_4cbd_87fa_f655c029a84f_49d613ad9c.avif",
      formats: {
        thumbnail: {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236495/c8293dae_fe52_4cbd_87fa_f655c029a84f_49d613ad9c.avif",
          width: 150,
          height: 150
        }
      }
    }],
    type: 'rent',
    property_status: 'available',
    featured: false,
    category: 'studio',
    price: {
      id: 3,
      amount: 55,
      currency: 'EUR',
      period: 'day'
    },
    specifications: {
      id: 3,
      total_area: 35,
      living_area: 30,
      bedrooms: 0,
      bathrooms: 1,
      floor: 2,
      total_floors: 4,
      year_built: 2018,
      parking_spaces: 0,
      furnished: true
    },
    features: {
      id: 3,
      air_conditioning: true,
      heating: false,
      internet: true,
      tv: true,
      washing_machine: false,
      dishwasher: false,
      pool: false,
      garden: false,
      terrace: false,
      garage: false,
      elevator: true,
      security: true,
      additional_features: ['City Center', 'Near Public Transport']
    },
    rental_terms: {
      id: 3,
      min_rental_period: 2,
      deposit_amount: 150,
      pets_allowed: false,
      smoking_allowed: false,
      utilities_included: true,
      additional_terms: ['Perfect for short stays', 'Walking distance to amenities']
    },
    location: {
      id: 3,
      address: "Santa Cruz, Tenerife",
      city: "Santa Cruz",
      region: "Tenerife",
      postal_code: "38001",
      latitude: 28.4636,
      longitude: -16.2518
    },
    contact: {
      id: 3,
      name: "Tenerifly",
      email: "accommodation@tenerifly.io",
      phone: "+34656641433",
      whatsapp: "+34656641433",
      telegram: null,
      preferred_contact: "whatsapp"
    },
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    publishedAt: "2025-01-01T00:00:00.000Z"
  }
];

interface AccommodationPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function AccommodationPage({ params }: AccommodationPageProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<Record<string, any>>({
    priceRange: [0, 200],
    type: '',
    bedrooms: '',
    location: '',
  });
  const [properties, setProperties] = useState(mockProperties);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  useEffect(() => {
    setMounted(true);
    params.then(({ locale }) => {
      setCurrentLocale(locale);
    });
  }, [params]);

  const handleFilterChange = (id: string, value: any) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleFilterReset = () => {
    setFilters({
      priceRange: [0, 200],
      type: '',
      bedrooms: '',
      location: '',
    });
  };

  const filteredProperties = properties.filter((property) => {
    if (filters.priceRange && property.price.amount > filters.priceRange[1]) {
      return false;
    }

    if (filters.type && property.type !== filters.type) {
      return false;
    }

    if (filters.bedrooms && property.specifications.bedrooms.toString() !== filters.bedrooms) {
      return false;
    }

    if (filters.location && property.location.city !== filters.location) {
      return false;
    }

    return true;
  });

  if (!mounted) {
    return null;
  }

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      <Title order={1} mb="xl">{t.sections.accommodation.title}</Title>

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
          <Grid>
            {filteredProperties.length === 0 ? (
              <Grid.Col>
                <Text ta="center" py="xl">{t.common.noResults}</Text>
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
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
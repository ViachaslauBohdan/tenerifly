'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, LoadingOverlay } from '@mantine/core';
import { FilterPanel, FilterConfig } from '@/components/filters/FilterPanel';
import { CarTile } from '@/components/tiles';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/types/locale';

const carFilters: FilterConfig[] = [
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
      { value: 'maintenance', label: 'Maintenance' },
    ],
  },
];

const mockCars = [
  {
    id: 1,
    title: "Toyota Yaris 2018",
    description: "Efficient city car with low fuel consumption",
    images: [{ url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227679/IMG_8305_da139a78e5.jpg" }],
    type: 'rent' as const,
    car_status: 'available' as const,
    price: { amount: 30, period: 'day' },
    specifications: {
      make: "Toyota",
      model: "Yaris",
      year: 2018,
      fuel: "Petrol",
      transmission: "Automatic",
      seats: 5,
    }
  },
  {
    id: 2,
    title: "Renault Clio",
    description: "Compact and fuel-efficient city car",
    images: [{ url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227680/IMG_8306_042adfadab.jpg" }],
    type: 'rent' as const,
    car_status: 'available' as const,
    price: { amount: 30, period: 'day' },
    specifications: {
      make: "Renault",
      model: "Clio",
      year: 2021,
      fuel: "Petrol",
      transmission: "Automatic",
      seats: 5,
    }
  }
];

interface CarsPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function CarsPage({ params }: CarsPageProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<Record<string, any>>({
    priceRange: [0, 200],
    type: '',
    status: '',
  });
  const [cars, setCars] = useState(mockCars);
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
      status: '',
    });
  };

  const filteredCars = cars.filter((car) => {
    if (filters.priceRange && car.price?.amount > filters.priceRange[1]) {
      return false;
    }

    if (filters.type && car.type !== filters.type) {
      return false;
    }
    if (filters.status && car.car_status !== filters.status) {
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
      <Title order={1} mb="xl">{t.sections.cars.title}</Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <FilterPanel
            config={carFilters}
            values={filters}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Grid>
            {filteredCars.length === 0 ? (
              <Grid.Col>
                <Text ta="center" py="xl">{t.common.noResults}</Text>
              </Grid.Col>
            ) : (
              filteredCars.map((car) => (
                <Grid.Col key={car.id} span={{ base: 12, sm: 6 }}>
                  <CarTile
                    title={car.title}
                    description={car.description || 'No description available'}
                    image={car.images?.[0]?.url || '/placeholder.jpg'}
                    type={car.type}
                    status={car.car_status}
                    price={`€${car.price?.amount || 0}${car.price?.period === 'day' ? '/day' : ''}`}
                    specifications={{
                      brand: car.specifications?.make || 'Unknown',
                      model: car.specifications?.model || 'Unknown',
                      year: car.specifications?.year || 0,
                      fuel_type: car.specifications?.fuel || 'Unknown',
                      transmission: car.specifications?.transmission || 'Unknown',
                      seats: car.specifications?.seats || 0,
                    }}
                    onView={() => window.open(`/${currentLocale}/cars/${car.id}`, '_self')}
                    currentLocale={currentLocale}
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
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Title, 
  Text, 
  Grid, 
  Card, 
  Badge, 
  Group, 
  Stack, 
  Button,
  Image,
  Tabs,
  List,
  Divider
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { 
  IconCar, 
  IconGasStation, 
  IconGauge, 
  IconUsers, 
  IconBrandWhatsapp,
  IconArrowLeft,
  IconCalendar,
  IconMapPin,
  IconPhone,
  IconMail
} from '@tabler/icons-react';
import { useTranslation } from '@/hooks/useTranslation';
import { openWhatsApp } from '@/utils/whatsapp';
import { Locale } from '@/types/locale';

interface CarDetailsProps {
  params: Promise<{ locale: Locale; id: string }>;
}

const mockCarData = {
  id: '1',
  title: 'Toyota Yaris 2018',
  description: 'Efficient city car with low fuel consumption. Perfect for city trips and exploring the island. Compact and easy to maneuver with modern features.',
  images: [
    'https://res.cloudinary.com/dlnvckilf/image/upload/v1745227679/IMG_8305_da139a78e5.jpg',
    'https://res.cloudinary.com/dlnvckilf/image/upload/v1745227680/IMG_8306_042adfadab.jpg',
    'https://res.cloudinary.com/dlnvckilf/image/upload/v1745227677/IMG_8291_695e2c4b89.jpg',
  ],
  price: {
    day1: 35,
    day3: 32,
    day7: 30,
    month: 700
  },
  specifications: {
    make: 'Toyota',
    model: 'Yaris',
    year: 2018,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engine: '1.5L',
    consumption: '5.2L/100km',
    seats: 5,
    doors: 5,
    trunk: '286L',
    color: 'Silver'
  },
  features: [
    'Air Conditioning',
    'Bluetooth Connectivity',
    'USB Charging Ports',
    'ECO Mode',
    'Electric Windows',
    'Central Locking',
    'ABS Brakes',
    'Airbags'
  ],
  rentalTerms: {
    minAge: 21,
    license: 'Valid driving license required',
    deposit: 150,
    insurance: 'Basic insurance included',
    mileage: 'Unlimited mileage',
    fuel: 'Return with same fuel level'
  },
  location: {
    address: 'Los Gigantes, Tenerife',
    coordinates: { lat: 28.2393, lng: -16.8416 }
  },
  contact: {
    name: 'Tenerifly Car Rental',
    phone: '+34656641433',
    email: 'cars@tenerifly.io',
    whatsapp: '+34656641433'
  },
  availability: true,
  rating: 4.6,
  reviews: 23
};

export default function CarDetailsPage({ params }: CarDetailsProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [carId, setCarId] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    params.then(({ locale, id }) => {
      setCurrentLocale(locale);
      setCarId(id);
    });
  }, [params]);

  if (!mounted) {
    return null;
  }

  const car = mockCarData; 

  return (
    <Container size="xl" py="xl">
      <Button
        variant="light"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.push(`/${currentLocale}/cars`)}
        mb="xl"
      >
        {t.common.backToHome}
      </Button>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="lg">
            <Title order={1} mb="md">{car.title}</Title>
            
            <Carousel withIndicators height={400} mb="lg">
              {car.images.map((image, index) => (
                <Carousel.Slide key={index}>
                  <Image
                    src={image}
                    alt={`${car.title} - Image ${index + 1}`}
                    height={400}
                    fit="cover"
                    radius="md"
                  />
                </Carousel.Slide>
              ))}
            </Carousel>

            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="specifications">Specifications</Tabs.Tab>
                <Tabs.Tab value="features">Features</Tabs.Tab>
                <Tabs.Tab value="terms">Rental Terms</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="lg">
                <Stack gap="md">
                  <Text size="lg">{car.description}</Text>
                  
                  <Grid>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconGasStation size={20} />
                        <Text fw={500}>{t.filters.fuel}:</Text>
                        <Text>{car.specifications.fuel}</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconGauge size={20} />
                        <Text fw={500}>{t.filters.transmission}:</Text>
                        <Text>{car.specifications.transmission}</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconUsers size={20} />
                        <Text fw={500}>{t.sections.cars.seats}:</Text>
                        <Text>{car.specifications.seats}</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconCar size={20} />
                        <Text fw={500}>{t.sections.cars.year}:</Text>
                        <Text>{car.specifications.year}</Text>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="specifications" pt="lg">
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text fw={500}>Make:</Text>
                        <Text>{car.specifications.make}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Model:</Text>
                        <Text>{car.specifications.model}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Year:</Text>
                        <Text>{car.specifications.year}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Engine:</Text>
                        <Text>{car.specifications.engine}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Consumption:</Text>
                        <Text>{car.specifications.consumption}</Text>
                      </Group>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text fw={500}>Fuel Type:</Text>
                        <Text>{car.specifications.fuel}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Transmission:</Text>
                        <Text>{car.specifications.transmission}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Seats:</Text>
                        <Text>{car.specifications.seats}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Doors:</Text>
                        <Text>{car.specifications.doors}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Trunk:</Text>
                        <Text>{car.specifications.trunk}</Text>
                      </Group>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>

              <Tabs.Panel value="features" pt="lg">
                <List spacing="sm">
                  {car.features.map((feature, index) => (
                    <List.Item key={index}>{feature}</List.Item>
                  ))}
                </List>
              </Tabs.Panel>

              <Tabs.Panel value="terms" pt="lg">
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text fw={500}>Minimum Age:</Text>
                    <Text>{car.rentalTerms.minAge} years</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fw={500}>Security Deposit:</Text>
                    <Text>€{car.rentalTerms.deposit}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fw={500}>Insurance:</Text>
                    <Text>{car.rentalTerms.insurance}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fw={500}>Mileage:</Text>
                    <Text>{car.rentalTerms.mileage}</Text>
                  </Group>
                  <Text size="sm" c="dimmed">{car.rentalTerms.license}</Text>
                  <Text size="sm" c="dimmed">{car.rentalTerms.fuel}</Text>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="lg" pos="sticky" style={{ top: 20 }}>
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs">
                  <Text size="xl" fw={700} c="blue">
                    €{car.price.day1}/{t.common.perDay}
                  </Text>
                  <Group gap="xs">
                    <Badge color="green" variant="light">
                      {car.availability ? 'Available' : 'Not Available'}
                    </Badge>
                    <Badge color="yellow" variant="light">
                      ⭐ {car.rating} ({car.reviews})
                    </Badge>
                  </Group>
                </Stack>
              </Group>

              <Divider />

              <Stack gap="sm">
                <Text fw={500}>Pricing:</Text>
                <Group justify="space-between">
                  <Text size="sm">1 day:</Text>
                  <Text size="sm" fw={500}>€{car.price.day1}/day</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">3+ days:</Text>
                  <Text size="sm" fw={500}>€{car.price.day3}/day</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">7+ days:</Text>
                  <Text size="sm" fw={500}>€{car.price.day7}/day</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Monthly:</Text>
                  <Text size="sm" fw={500}>€{car.price.month}/month</Text>
                </Group>
              </Stack>

              <Divider />

              <Stack gap="sm">
                <Group gap="xs">
                  <IconMapPin size={16} />
                  <Text size="sm">{car.location.address}</Text>
                </Group>
                <Group gap="xs">
                  <IconPhone size={16} />
                  <Text size="sm">{car.contact.phone}</Text>
                </Group>
                <Group gap="xs">
                  <IconMail size={16} />
                  <Text size="sm">{car.contact.email}</Text>
                </Group>
              </Stack>

              <Button
                fullWidth
                size="lg"
                leftSection={<IconBrandWhatsapp size={20} />}
                color="green"
                onClick={() => openWhatsApp('car', {
                  title: car.title,
                  brand: car.specifications.make,
                  model: car.specifications.model,
                  price: `€${car.price.day1}/day`
                }, currentLocale)}
              >
                {t.common.bookNow}
              </Button>

              <Button
                fullWidth
                variant="light"
                leftSection={<IconCalendar size={20} />}
              >
                Check Availability
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
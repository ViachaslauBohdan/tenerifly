'use client';

import { Container, Title, Text, Tabs, Button, Group, Card, Image, SimpleGrid, rem, Grid, Avatar, Badge, Select, Stack, NumberInput, ActionIcon, Anchor } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconHome, IconCar, IconMap, IconPlane, IconStar, IconHeart, IconLocation, IconPhone, IconMail, IconLanguage, IconClock, IconUsers, IconCurrencyEuro, IconBrandWhatsapp } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';
import { openWhatsApp } from '@/utils/whatsapp';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Locale } from '@/types/locale';

interface LocalePageClientProps {
  params: Promise<{ locale: Locale }>;
}

export function LocalePageClient({ params }: LocalePageClientProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [guests, setGuests] = useState(2);
  const [excursionType, setExcursionType] = useState('all');
  const [excursionDate, setExcursionDate] = useState<Date | null>(null);
  const [excursionPeople, setExcursionPeople] = useState(2);
  const [carType, setCarType] = useState('all');
  const [activeTab, setActiveTab] = useState('excursions');

  useEffect(() => {
    setMounted(true);
    // Получаем locale из params
    params.then(({ locale }) => {
      setCurrentLocale(locale);
    });
  }, [params]);

  if (!mounted) {
    return null;
  }

  // Данные для секций (возвращаем весь контент)
  const excursions = [
    {
      title: "Teide National Park",
      description: "Visit Spain's highest peak and enjoy breathtaking views",
      image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227161/roques_de_garcia_pl_61b31e3ebb.webp",
      duration: "8 hours",
      groupSize: "Max 8 people",
      price: "€45",
      rating: 4.8
    },
    {
      title: "Whale Watching",
      description: "Watch whales and dolphins in their natural habitat",
      image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227091/new_File_2_980bf647f4.avif",
      duration: "4 hours",
      groupSize: "Max 12 people",
      price: "€35",
      rating: 4.9
    },
    {
      title: "Loro Parque",
      description: "Visit one of Europe's best zoological parks",
      image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227219/G_1cf1604009.webp",
      duration: "6 hours",
      groupSize: "Max 15 people",
      price: "€40",
      rating: 4.7
    }
  ];

  const cars = [
    {
      title: "Toyota Yaris 2018",
      description: "Efficient city car with low fuel consumption. Perfect for city trips and exploring the island.",
      image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227679/IMG_8305_da139a78e5.jpg",
      price: "€30/day",
      transmission: "Automatic",
      features: "A/C, 5 Seats, Bluetooth, USB, ECO Mode",
      rating: 4.6
    },
    {
      title: "Renault Clio",
      description: "Compact and fuel-efficient city car with modern features.",
      image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227680/IMG_8306_042adfadab.jpg",
      price: "€30/day",
      transmission: "Automatic",
      features: "A/C, 5 Seats, Bluetooth, USB, ECO Mode",
      rating: 4.7
    },
    {
      title: "Economy Car",
      description: "Perfect for city driving and small trips",
      image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227677/IMG_8291_695e2c4b89.jpg",
      price: "€30/day",
      transmission: "Automatic",
      features: "A/C, 5 Seats",
      rating: 4.5
    }
  ];

  const accommodation = [
    {
      title: "Beachfront Apartment",
      description: "Modern apartment with ocean views",
      image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236816/olivia_0bd8b39b42.jpg",
      price: "€70/night",
      location: "Los Gigantes",
      amenities: "WiFi, Pool, Kitchen",
      rating: 4.6
    },
    {
      title: "Mountain Villa",
      description: "Spacious villa with mountain views",
      image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745237011/olivia3_f4dcd69705.jpg",
      price: "€65/night",
      location: "Los Gigantes",
      amenities: "WiFi, Garden, Parking",
      rating: 4.8
    },
    {
      title: "City Studio",
      description: "Cozy studio in the heart of the city",
      image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236495/c8293dae_fe52_4cbd_87fa_f655c029a84f_49d613ad9c.avif",
      price: "€70/night",
      location: "Los Gigantes",
      amenities: "WiFi, Kitchen",
      rating: 4.4
    }
  ];

  return (
    <main>
      {/* Language Selector */}
      <Container size="xl" style={{ position: 'absolute', top: 20, right: 20, zIndex: 100 }}>
        <LanguageSwitcher />
      </Container>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <Container size="xl" className={styles.heroContent}>
          <Title order={1} size={rem(60)} c="white" mb="md">
            {t.hero.title}
          </Title>
          <Text size="xl" c="white" mb="xl">
            {t.hero.subtitle}
          </Text>
          
          <Card className={styles.searchForm} shadow="sm">
            <Tabs defaultValue="accommodation" value={activeTab} onChange={(value) => value && setActiveTab(value)}>
              <Tabs.List>
                <Tabs.Tab value="accommodation">
                  {t.hero.tabs.accommodation}
                </Tabs.Tab>
                <Tabs.Tab value="cars">
                  {t.hero.tabs.cars}
                </Tabs.Tab>
                <Tabs.Tab value="excursions">
                  {t.hero.tabs.excursions}
                </Tabs.Tab>
              </Tabs.List>

              <div className={styles.searchForm}>
                <Tabs.Panel value="accommodation" pt="lg">
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 3 }}>
                      <Select
                        label={t.hero.accommodation.type}
                        placeholder="Select type"
                        data={t.hero.accommodation.types}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <DatePickerInput
                        type="range"
                        label={`${t.hero.accommodation.checkin} - ${t.hero.accommodation.checkout}`}
                        placeholder="Select dates"
                        value={dates}
                        onChange={setDates}
                        minDate={new Date()}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 3 }}>
                      <NumberInput
                        label={t.hero.accommodation.guests}
                        placeholder="Guests"
                        value={guests}
                        onChange={(val) => setGuests(Number(val))}
                        min={1}
                        max={10}
                      />
                    </Grid.Col>
                  </Grid>
                </Tabs.Panel>

                <Tabs.Panel value="cars" pt="lg">
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <Select
                        label={t.hero.cars.type}
                        placeholder="Select car type"
                        data={t.hero.cars.types}
                        value={carType}
                        onChange={(value) => setCarType(value || 'all')}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                      <DatePickerInput
                        type="range"
                        label={`${t.hero.cars.pickup} - ${t.hero.cars.dropoff}`}
                        placeholder="Select dates"
                        value={dates}
                        onChange={setDates}
                        minDate={new Date()}
                      />
                    </Grid.Col>
                  </Grid>
                </Tabs.Panel>

                <Tabs.Panel value="excursions" pt="lg">
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <Select
                        label={t.hero.excursions.type}
                        placeholder="Select type"
                        data={t.hero.excursions.types}
                        value={excursionType}
                        onChange={(value) => setExcursionType(value || 'all')}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <DatePickerInput
                        label={t.hero.excursions.date}
                        placeholder="Select date"
                        value={excursionDate}
                        onChange={setExcursionDate}
                        minDate={new Date()}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <NumberInput
                        label={t.hero.excursions.people}
                        placeholder="Number of people"
                        value={excursionPeople}
                        onChange={(val) => setExcursionPeople(Number(val))}
                        min={1}
                        max={20}
                      />
                    </Grid.Col>
                  </Grid>
                </Tabs.Panel>
              </div>
              
              <Button 
                className={styles.searchButton}
                fullWidth 
                mt="lg"
                onClick={() => {
                  switch (activeTab) {
                    case 'excursions':
                      router.push(`/${currentLocale}/excursions`);
                      break;
                    case 'cars':
                      router.push(`/${currentLocale}/cars`);
                      break;
                    case 'accommodation':
                      router.push(`/${currentLocale}/accommodation`);
                      break;
                  }
                }}
              >
                {t.hero.search}
              </Button>
            </Tabs>
          </Card>
        </Container>
      </section>

      <section className={styles.sectionAlt}>
        <Container size="xl">
          <Stack align="center" mb="xl">
            <Title order={2}>{t.sections.excursions.title}</Title>
            <Text size="lg" c="dimmed">{t.sections.excursions.subtitle}</Text>
          </Stack>
          
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
            {excursions.map((excursion, index) => (
              <Card key={index} withBorder padding="xl" radius="md">
                <Card.Section>
                  <Image
                    src={excursion.image}
                    height={200}
                    alt={excursion.title}
                  />
                </Card.Section>

                <Group justify="space-between" mt="md">
                  <Text size="lg" fw={500}>{excursion.title}</Text>
                  <Badge leftSection={<IconStar size={14} />} color="yellow">
                    {excursion.rating}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed" mt="sm">
                  {excursion.description}
                </Text>

                <Group mt="md" gap="xs">
                  <IconClock size={16} />
                  <Text size="sm">{t.sections.excursions.duration}: {excursion.duration}</Text>
                </Group>

                <Group mt="xs" gap="xs">
                  <IconUsers size={16} />
                  <Text size="sm">{t.sections.excursions.groupSize}: {excursion.groupSize}</Text>
                </Group>

                <Group mt="xs" gap="xs">
                  <IconCurrencyEuro size={16} />
                  <Text size="sm">{t.sections.excursions.price}: {excursion.price}</Text>
                </Group>

                <Button
                  variant="filled"
                  size="md"
                  fullWidth
                  mt="md"
                  onClick={() => openWhatsApp('excursion', {
                    title: excursion.title,
                    price: excursion.price
                  }, currentLocale)}
                >
                  {t.common.bookNow}
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      <section className={styles.section}>
        <Container size="xl">
          <Stack align="center" mb="xl">
            <Title order={2}>{t.sections.cars.title}</Title>
            <Text size="lg" c="dimmed">{t.sections.cars.subtitle}</Text>
          </Stack>
          
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
            {cars.map((car, index) => (
              <Card key={index} withBorder padding="xl" radius="md">
                <Card.Section>
                  <Image
                    src={car.image}
                    height={200}
                    alt={car.title}
                  />
                </Card.Section>

                <Group justify="space-between" mt="md">
                  <Text size="lg" fw={500}>{car.title}</Text>
                  <Badge leftSection={<IconStar size={14} />} color="yellow">
                    {car.rating}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed" mt="sm">
                  {car.description}
                </Text>

                <Group mt="md" gap="xs">
                  <IconCar size={16} />
                  <Text size="sm">{t.sections.cars.transmission}: {car.transmission}</Text>
                </Group>

                <Group mt="xs" gap="xs">
                  <IconHome size={16} />
                  <Text size="sm">{t.sections.cars.features}: {car.features}</Text>
                </Group>

                <Group mt="xs" gap="xs">
                  <IconCurrencyEuro size={16} />
                  <Text size="sm">{car.price}</Text>
                </Group>

                <Button
                  variant="filled"
                  size="md"
                  fullWidth
                  mt="md"
                  onClick={() => openWhatsApp('car', {
                    title: car.title,
                    price: car.price
                  }, currentLocale)}
                >
                  {t.common.bookNow}
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      <section className={styles.sectionAlt}>
        <Container size="xl">
          <Stack align="center" mb="xl">
            <Title order={2}>{t.sections.accommodation.title}</Title>
            <Text size="lg" c="dimmed">{t.sections.accommodation.subtitle}</Text>
          </Stack>
          
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
            {accommodation.map((place, index) => (
              <Card key={index} withBorder padding="xl" radius="md">
                <Card.Section>
                  <Image
                    src={place.image}
                    height={200}
                    alt={place.title}
                  />
                </Card.Section>

                <Group justify="space-between" mt="md">
                  <Text size="lg" fw={500}>{place.title}</Text>
                  <Badge leftSection={<IconStar size={14} />} color="yellow">
                    {place.rating}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed" mt="sm">
                  {place.description}
                </Text>

                <Group mt="md" gap="xs">
                  <IconLocation size={16} />
                  <Text size="sm">{t.sections.accommodation.location}: {place.location}</Text>
                </Group>

                <Group mt="xs" gap="xs">
                  <IconHome size={16} />
                  <Text size="sm">{t.sections.accommodation.amenities}: {place.amenities}</Text>
                </Group>

                <Group mt="xs" gap="xs">
                  <IconCurrencyEuro size={16} />
                  <Text size="sm">{place.price}</Text>
                </Group>

                <Button
                  variant="filled"
                  size="md"
                  fullWidth
                  mt="md"
                  onClick={() => openWhatsApp('accommodation', {
                    title: place.title,
                    price: place.price
                  }, currentLocale)}
                >
                  {t.common.bookNow}
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      <section style={{ padding: '80px 0', backgroundColor: '#f8f9fa' }}>
        <Container size="xl">
          <Card withBorder padding="xl" radius="md" style={{ textAlign: 'center' }}>
            <Title order={2} mb="md">{t.cta.title}</Title>
            <Text size="lg" mb="xl">{t.cta.subtitle}</Text>
            <Button 
              size="lg" 
              leftSection={<IconPhone size={20} />}
              component="a"
              href="https://wa.me/34656641433"
              target="_blank"
            >
              {t.cta.button}
            </Button>
          </Card>
        </Container>
      </section>

      <footer style={{ padding: '80px 0', backgroundColor: '#1a1b1e' }}>
        <Container size="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Title order={3} c="white" mb="md">Tenerifly.io</Title>
              <Text c="dimmed">{t.footer.description}</Text>
              <Text size="sm" c="dimmed" mt="md">
                © {new Date().getFullYear()} Tenerifly. All rights reserved.
              </Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Title order={4} c="white" mb="md">{t.footer.services}</Title>
              <Stack gap="xs">
                <Anchor href={`/${currentLocale}/cars`} underline="never" c="dimmed">
                  <Text size="sm">Airport Transfers</Text>
                </Anchor>
                <Anchor href={`/${currentLocale}/excursions`} underline="never" c="dimmed">
                  <Text size="sm">Excursions & Tours</Text>
                </Anchor>
                <Anchor href={`/${currentLocale}/accommodation`} underline="never" c="dimmed">
                  <Text size="sm">Property Rental & Sales</Text>
                </Anchor>
                <Anchor href={`/${currentLocale}/cars`} underline="never" c="dimmed">
                  <Text size="sm">Car Rental Services</Text>
                </Anchor>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Title order={4} c="white" mb="md">{t.footer.contacts}</Title>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">+34656641433</Text>
                <Text size="sm" c="dimmed">info@tenerifly.io</Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </footer>
    </main>
  );
}
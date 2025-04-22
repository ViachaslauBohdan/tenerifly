'use client';

import { Container, Title, Text, Tabs, Button, Group, Card, Image, SimpleGrid, rem, Grid, Avatar, Badge, Select, Stack, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconHome, IconCar, IconMap, IconPlane, IconStar, IconHeart, IconLocation, IconPhone, IconMail, IconLanguage, IconClock, IconUsers, IconCurrencyEuro } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { openWhatsApp } from '@/utils/whatsapp';

const translations = {
  en: {
    hero: {
      title: "Welcome to Tenerife",
      subtitle: "Find accommodation, excursions or car rental",
      search: "Search",
      tabs: {
        excursions: "Excursions",
        cars: "Cars",
        accommodation: "Accommodation"
      },
      excursions: {
        title: "Excursions",
        type: "Type of excursion",
        date: "Date",
        people: "Number of people",
        types: [
          { value: 'all', label: 'All excursions' },
          { value: 'teide', label: 'Teide National Park' },
          { value: 'water', label: 'Water activities' },
          { value: 'culture', label: 'Cultural tours' }
        ]
      },
      cars: {
        title: "Cars",
        pickup: "Pick-up date",
        dropoff: "Drop-off date",
        type: "Car type",
        types: [
          { value: 'all', label: 'All cars' },
          { value: 'economy', label: 'Economy' },
          { value: 'standard', label: 'Standard' },
          { value: 'premium', label: 'Premium' }
        ]
      },
      accommodation: {
        title: "Accommodation",
        checkin: "Check-in",
        checkout: "Check-out",
        guests: "Guests",
        type: "Property type",
        types: [
          { value: 'all', label: 'All properties' },
          { value: 'apartment', label: 'Apartments' },
          { value: 'villa', label: 'Villas' },
          { value: 'hotel', label: 'Hotels' }
        ]
      }
    },
    quickLinks: {
      title: "Quick Links",
      apartments: "Apartments",
      tours: "Tours",
      cars: "Cars",
      special: "Special Offers"
    },
    topOffers: "Top Offers",
    map: "Interactive Map",
    reviews: "Customer Reviews",
    blog: {
      title: "Tenerife Guide",
      whereToLive: "Where to Live",
      description: "Detailed guide to island areas"
    },
    cta: {
      title: "Don't know where to start?",
      subtitle: "Get a personal selection!",
      button: "Write on WhatsApp"
    },
    excursions: {
      title: "Popular Excursions",
      subtitle: "Discover the best of Tenerife",
      duration: "Duration",
      groupSize: "Group Size",
      price: "Price",
      bookNow: "Book Now",
      items: [
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
      ]
    },
    cars: {
      title: "Car Rental",
      subtitle: "Find the perfect car for your Tenerife adventure",
      features: "Features",
      transmission: "Transmission",
      bookNow: "Book Now",
      items: [
        {
          title: "Economy Car",
          description: "Perfect for city driving and small trips",
          image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227677/IMG_8291_695e2c4b89.jpg",
          price: "€30/day",
          transmission: "Automatic",
          features: "A/C, 5 Seats",
          rating: 4.5
        },
        {
          title: "Toyota Yaris 2018",
          description: "Efficient city car with low fuel consumption. Perfect for city trips and exploring the island. Compact and easy to maneuver.",
          image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227679/IMG_8305_da139a78e5.jpg",
          price: "€30/day",
          transmission: "Automatic",
          features: "A/C, 5 Seats, Bluetooth, USB, ECO Mode",
          specifications: {
            year: 2018,
            fuel: "Petrol",
            engine: "1.5L",
            consumption: "5.2L/100km",
            trunk: "286L"
          },
          rating: 4.6
        },
        {
          title: "Renault Clio",
          description: "Compact and fuel-efficient city car with modern features. Perfect for both city driving and exploring the island.",
          image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227680/IMG_8306_042adfadab.jpg",
          price: "€30/day",
          transmission: "Automatic",
          features: "A/C, 5 Seats, Bluetooth, USB, ECO Mode",
          specifications: {
            year: 2021,
            fuel: "Petrol",
            engine: "1.0L",
            consumption: "4.8L/100km",
            trunk: "391L"
          },
          rating: 4.7
        }
      ]
    },
    accommodation: {
      title: "Places to Stay",
      subtitle: "Find your perfect accommodation in Tenerife",
      amenities: "Amenities",
      location: "Location",
      bookNow: "Book Now",
      items: [
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
      ]
    },
    footer: {
      description: "Your guide to Tenerife",
      contacts: "Contacts",
      social: "Social Media"
    }
  },
  pl: {
    hero: {
      title: "Witamy na Teneryfie",
      subtitle: "Znajdź zakwaterowanie, wycieczki lub wynajem samochodu",
      search: "Szukaj",
      tabs: {
        excursions: "Wycieczki",
        cars: "Samochody",
        accommodation: "Zakwaterowanie"
      },
      excursions: {
        title: "Wycieczki",
        type: "Rodzaj wycieczki",
        date: "Data",
        people: "Liczba osób",
        types: [
          { value: 'all', label: 'Wszystkie wycieczki' },
          { value: 'teide', label: 'Park Narodowy Teide' },
          { value: 'water', label: 'Aktywności wodne' },
          { value: 'culture', label: 'Wycieczki kulturowe' }
        ]
      },
      cars: {
        title: "Samochody",
        pickup: "Data odbioru",
        dropoff: "Data zwrotu",
        type: "Typ samochodu",
        types: [
          { value: 'all', label: 'Wszystkie samochody' },
          { value: 'economy', label: 'Ekonomiczne' },
          { value: 'standard', label: 'Standardowe' },
          { value: 'premium', label: 'Premium' }
        ]
      },
      accommodation: {
        title: "Zakwaterowanie",
        checkin: "Zameldowanie",
        checkout: "Wymeldowanie",
        guests: "Goście",
        type: "Typ zakwaterowania",
        types: [
          { value: 'all', label: 'Wszystkie obiekty' },
          { value: 'apartment', label: 'Apartamenty' },
          { value: 'villa', label: 'Wille' },
          { value: 'hotel', label: 'Hotele' }
        ]
      }
    },
    quickLinks: {
      title: "Szybkie linki",
      apartments: "Apartamenty",
      tours: "Wycieczki",
      cars: "Samochody",
      special: "Oferty specjalne"
    },
    topOffers: "Najlepsze oferty",
    map: "Mapa interaktywna",
    reviews: "Opinie klientów",
    blog: {
      title: "Przewodnik po Teneryfie",
      whereToLive: "Gdzie zamieszkać",
      description: "Szczegółowy przewodnik po obszarach wyspy"
    },
    cta: {
      title: "Nie wiesz od czego zacząć?",
      subtitle: "Otrzymaj spersonalizowaną ofertę!",
      button: "Napisz na WhatsApp"
    },
    footer: {
      description: "Twój przewodnik po Teneryfie",
      contacts: "Kontakt",
      social: "Media społecznościowe"
    },
    excursions: {
      title: "Popularne wycieczki",
      subtitle: "Odkryj najlepsze miejsca na Teneryfie",
      duration: "Czas trwania",
      groupSize: "Rozmiar grupy",
      price: "Cena",
      bookNow: "Zarezerwuj",
      items: [
        {
          title: "Park Narodowy Teide",
          description: "Odwiedź najwyższy szczyt Hiszpanii i podziwiaj zapierające dech w piersiach widoki",
          image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227161/roques_de_garcia_pl_61b31e3ebb.webp",
          duration: "8 godzin",
          groupSize: "Max 8 osób",
          price: "45€",
          rating: 4.8
        },
        {
          title: "Obserwacja wielorybów",
          description: "Podziwiaj wieloryby i delfiny w ich naturalnym środowisku",
          image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227091/new_File_2_980bf647f4.avif",
          duration: "4 godziny",
          groupSize: "Max 12 osób",
          price: "35€",
          rating: 4.9
        },
        {
          title: "Loro Parque",
          description: "Odwiedź jeden z najlepszych ogrodów zoologicznych w Europie",
          image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227219/G_1cf1604009.webp",
          duration: "6 godzin",
          groupSize: "Max 15 osób",
          price: "40€",
          rating: 4.7
        }
      ]
    },
    cars: {
      title: "Wynajem Samochodów",
      subtitle: "Znajdź idealny samochód dla Twojej wycieczki na Teneryfę",
      features: "Cechy",
      transmission: "Skrzynia biegów",
      bookNow: "Zarezerwuj",
      items: [
        {
          title: "Samochód Ekonomiczny",
          description: "Idealny do jazdy w mieście i krótkich wycieczek",
          image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227677/IMG_8291_695e2c4b89.jpg",
          price: "€30/dzień",
          transmission: "Automatyczna",
          features: "Klimatyzacja, 5 miejsc",
          rating: 4.5
        },
        {
          title: "Toyota Yaris 2018",
          description: "Ekonomiczny samochód miejski z niskim zużyciem paliwa. Idealny do podróży po mieście i zwiedzania wyspy. Kompaktowy i zwrotny.",
          image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227679/IMG_8305_da139a78e5.jpg",
          price: "€35/dzień",
          transmission: "Automatyczna",
          features: "Klimatyzacja, 5 miejsc, Bluetooth, USB, Tryb ECO",
          specifications: {
            year: 2018,
            fuel: "Benzyna",
            engine: "1.5L",
            consumption: "5.2L/100km",
            trunk: "286L"
          },
          rating: 4.6
        },
        {
          title: "Renault Clio",
          description: "Kompaktowy i ekonomiczny samochód miejski z nowoczesnymi funkcjami. Idealny zarówno do jazdy po mieście, jak i zwiedzania wyspy.",
          image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745227680/IMG_8306_042adfadab.jpg",
          price: "€40/dzień",
          transmission: "Automatyczna",
          features: "Klimatyzacja, 5 miejsc, Bluetooth, USB, Tryb ECO",
          specifications: {
            year: 2021,
            fuel: "Benzyna",
            engine: "1.0L",
            consumption: "4.8L/100km",
            trunk: "391L"
          },
          rating: 4.7
        }
      ]
    },
    accommodation: {
      title: "Miejsca do Zamieszkania",
      subtitle: "Znajdź idealne zakwaterowanie w Tenerife",
      amenities: "Udogodnienia",
      location: "Lokalizacja",
      bookNow: "Zarezerwuj",
      items: [
        {
          title: "Apartament Oceanfrontowy",
          description: "Nowoczesny apartament z widokiem na ocean",
          image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236816/olivia_0bd8b39b42.jpg",
          price: "€80/noc",
          location: "Los Cristianos",
          amenities: "WiFi, Basen, Kuchnia",
          rating: 4.6
        },
        {
          title: "Villa Górska",
          description: "Przestronna vila z widokiem na góry",
          image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745237011/olivia3_f4dcd69705.jpg",
          price: "€150/noc",
          location: "La Orotava",
          amenities: "WiFi, Ogród, Parking",
          rating: 4.8
        },
        {
          title: "Studio w Centrum",
          description: "Cudne studio w sercu miasta",
          image: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745236495/c8293dae_fe52_4cbd_87fa_f655c029a84f_49d613ad9c.avif",
          price: "€60/noc",
          location: "Santa Cruz",
          amenities: "WiFi, Kuchnia",
          rating: 4.4
        }
      ]
    }
  }
};

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<'en' | 'pl'>('en');
  const t = translations[language];
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [guests, setGuests] = useState(2);
  const [excursionType, setExcursionType] = useState('all');
  const [excursionDate, setExcursionDate] = useState<Date | null>(null);
  const [excursionPeople, setExcursionPeople] = useState(2);
  const [carType, setCarType] = useState('all');
  const [activeTab, setActiveTab] = useState('excursions');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration issues by not rendering until mounted
  }

  return (
    <main>
      {/* Language Selector */}
      <Container size="xl" style={{ position: 'absolute', top: 20, right: 20, zIndex: 100 }}>
        <Select
          value={language}
          onChange={(value) => setLanguage(value as 'en' | 'pl')}
          data={[
            { value: 'en', label: 'English' },
            { value: 'pl', label: 'Polski' }
          ]}
          leftSection={<IconLanguage size={20} />}
        />
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
          
          <Card withBorder p="xl" radius="md" style={{ maxWidth: 800 }}>
            <Tabs defaultValue="excursions" value={activeTab} onChange={(value) => value && setActiveTab(value)}>
              <Tabs.List grow>
                <Tabs.Tab value="excursions" leftSection={<IconMap size={20} />}>
                  {t.hero.tabs.excursions}
                </Tabs.Tab>
                <Tabs.Tab value="cars" leftSection={<IconCar size={20} />}>
                  {t.hero.tabs.cars}
                </Tabs.Tab>
                <Tabs.Tab value="accommodation" leftSection={<IconHome size={20} />}>
                  {t.hero.tabs.accommodation}
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="excursions" pt="xl">
                <Grid>
                  <Grid.Col span={4}>
                    <Select
                      label={t.hero.excursions.type}
                      data={t.hero.excursions.types}
                      value={excursionType}
                      onChange={(value) => setExcursionType(value || 'all')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <DatePickerInput
                      label={t.hero.excursions.date}
                      value={excursionDate}
                      onChange={setExcursionDate}
                      minDate={new Date()}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <NumberInput
                      label={t.hero.excursions.people}
                      value={excursionPeople}
                      onChange={(val) => setExcursionPeople(Number(val))}
                      min={1}
                      max={20}
                    />
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>

              <Tabs.Panel value="cars" pt="xl">
                <Grid>
                  <Grid.Col span={4}>
                    <Select
                      label={t.hero.cars.type}
                      data={t.hero.cars.types}
                      value={carType}
                      onChange={(value) => setCarType(value || 'all')}
                    />
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <DatePickerInput
                      type="range"
                      label={`${t.hero.cars.pickup} - ${t.hero.cars.dropoff}`}
                      value={dates}
                      onChange={setDates}
                      minDate={new Date()}
                    />
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>

              <Tabs.Panel value="accommodation" pt="xl">
                <Grid>
                  <Grid.Col span={4}>
                    <Select
                      label={t.hero.accommodation.type}
                      data={t.hero.accommodation.types}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <DatePickerInput
                      type="range"
                      label={`${t.hero.accommodation.checkin} - ${t.hero.accommodation.checkout}`}
                      value={dates}
                      onChange={setDates}
                      minDate={new Date()}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <NumberInput
                      label={t.hero.accommodation.guests}
                      value={guests}
                      onChange={(val) => setGuests(Number(val))}
                      min={1}
                      max={10}
                    />
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>
              
              <Button 
                fullWidth 
                size="lg" 
                mt="xl"
                onClick={() => {
                  switch (activeTab) {
                    case 'excursions':
                      router.push('/excursions');
                      break;
                    case 'cars':
                      router.push('/cars');
                      break;
                    case 'accommodation':
                      router.push('/accommodation');
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

      {/* Excursions Section */}
      <section className={styles.sectionAlt}>
        <Container size="xl">
          <Stack align="center" mb="xl">
            <Title order={2}>{t.excursions.title}</Title>
            <Text size="lg" c="dimmed">{t.excursions.subtitle}</Text>
          </Stack>
          
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
            {t.excursions.items.map((excursion, index) => (
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
                  <Text size="sm">{t.excursions.duration}: {excursion.duration}</Text>
                </Group>

                <Group mt="xs" gap="xs">
                  <IconUsers size={16} />
                  <Text size="sm">{t.excursions.groupSize}: {excursion.groupSize}</Text>
                </Group>

                <Group mt="xs" gap="xs">
                  <IconCurrencyEuro size={16} />
                  <Text size="sm">{t.excursions.price}: {excursion.price}</Text>
                </Group>

                <Button
                  variant="filled"
                  size="md"
                  fullWidth
                  mt="md"
                >
                  {t.excursions.bookNow}
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      {/* Cars Section */}
      <section className={styles.section}>
        <Container size="xl">
          <Stack align="center" mb="xl">
            <Title order={2}>{t.cars.title}</Title>
            <Text size="lg" c="dimmed">{t.cars.subtitle}</Text>
          </Stack>
          
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
            {t.cars.items.map((car, index) => (
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
                  <Text size="sm">{t.cars.transmission}: {car.transmission}</Text>
                </Group>

                <Group mt="xs" gap="xs">
                  <IconHome size={16} />
                  <Text size="sm">{t.cars.features}: {car.features}</Text>
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
                >
                  {t.cars.bookNow}
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      {/* Accommodation Section */}
      <section className={styles.sectionAlt}>
        <Container size="xl">
          <Stack align="center" mb="xl">
            <Title order={2}>{t.accommodation.title}</Title>
            <Text size="lg" c="dimmed">{t.accommodation.subtitle}</Text>
          </Stack>
          
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
            {t.accommodation.items.map((place, index) => (
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
                  <Text size="sm">{t.accommodation.location}: {place.location}</Text>
                </Group>

                <Group mt="xs" gap="xs">
                  <IconHome size={16} />
                  <Text size="sm">{t.accommodation.amenities}: {place.amenities}</Text>
                </Group>

                <Group mt="xs" gap="xs">
                  <IconCurrencyEuro size={16} />
                  <Text size="sm">{place.price}</Text>
                </Group>

                <Button fullWidth mt="xl" leftSection={<IconHome size={20} />}>
                  {t.accommodation.bookNow}
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      {/* Map Section 
      <section style={{ padding: '80px 0' }}>
        <Container size="xl">
          <Title order={2} mb="xl">{t.map}</Title>
          <Card withBorder p="xl" radius="md">
            <div style={{ height: '500px', backgroundColor: '#f8f9fa' }}>
              <Text c="dimmed" ta="center" pt="xl">Map coming soon</Text>
            </div>
          </Card>
        </Container>
      </section>
      */}

      {/* Reviews Section 
      <section style={{ padding: '80px 0', backgroundColor: '#f8f9fa' }}>
        <Container size="xl">
          <Title order={2} mb="xl">{t.reviews}</Title>
          <Carousel
            withIndicators
            height={300}
            slideSize="33.333333%"
            slideGap="md"
            align="start"
            slidesToScroll={1}
          >
          </Carousel>
        </Container>
      </section>
      */}

      {/* Blog Section
      <section style={{ padding: '80px 0' }}>
        <Container size="xl">
          <Title order={2} mb="xl">{t.blog.title}</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
            <Card withBorder padding="xl" radius="md">
              <Card.Section>
                <Image
                  src="/blog-1.jpg"
                  height={200}
                  alt="Blog post"
                />
              </Card.Section>
              <Text size="lg" fw={500} mt="md">{t.blog.whereToLive}</Text>
              <Text size="sm" c="dimmed" mt="sm">
                {t.blog.description}
              </Text>
            </Card>
          </SimpleGrid>
        </Container>
      </section>
      */}
      

      {/* CTA Section */}
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

      {/* Footer */}
      <footer style={{ padding: '80px 0', backgroundColor: '#1a1b1e' }}>
        <Container size="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Title order={3} c="white" mb="md">Tenerifly.io</Title>
              <Text c="dimmed">{t.footer.description}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Title order={4} c="white" mb="md">{t.footer.contacts}</Title>
              <Group>
                <IconPhone size={20} />
                <Text c="dimmed">+34656641433</Text>
              </Group>
              <Group mt="md">
                <IconMail size={20} />
                <Text c="dimmed">info@tenerifly.io</Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Title order={4} c="white" mb="md">{t.footer.social}</Title>
              <Group>
                {/* Add social media icons */}
              </Group>
            </Grid.Col>
          </Grid>
        </Container>
      </footer>
    </main>
  );
}

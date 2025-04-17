'use client';

import { Container, Title, Text, Tabs, Button, Group, Card, Image, SimpleGrid, rem, Grid, Avatar, Badge, Select, Stack } from '@mantine/core';
import { IconHome, IconCar, IconMap, IconPlane, IconStar, IconHeart, IconLocation, IconPhone, IconMail, IconLanguage, IconClock, IconUsers, IconCurrencyEuro } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import { useState, useEffect } from 'react';

const translations = {
  en: {
    hero: {
      title: "Welcome to Tenerife",
      subtitle: "Find accommodation, tours or car rental",
      search: "Search",
      accommodation: "Accommodation",
      tours: "Tours",
      cars: "Cars"
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
    footer: {
      description: "Your guide to Tenerife",
      contacts: "Contacts",
      social: "Social Media"
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
          image: "/excursions/teide.jpg",
          duration: "8 hours",
          groupSize: "Max 8 people",
          price: "€45",
          rating: 4.8
        },
        {
          title: "Whale Watching",
          description: "Watch whales and dolphins in their natural habitat",
          image: "/excursions/whale.jpg",
          duration: "4 hours",
          groupSize: "Max 12 people",
          price: "€35",
          rating: 4.9
        },
        {
          title: "Loro Parque",
          description: "Visit one of Europe's best zoological parks",
          image: "/excursions/loro.jpg",
          duration: "6 hours",
          groupSize: "Max 15 people",
          price: "€40",
          rating: 4.7
        }
      ]
    }
  },
  pl: {
    hero: {
      title: "Witamy na Teneryfie",
      subtitle: "Znajdź zakwaterowanie, wycieczki lub wynajem samochodu",
      search: "Szukaj",
      accommodation: "Zakwaterowanie",
      tours: "Wycieczki",
      cars: "Samochody"
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
          image: "/excursions/teide.jpg",
          duration: "8 godzin",
          groupSize: "Max 8 osób",
          price: "45€",
          rating: 4.8
        },
        {
          title: "Obserwacja wielorybów",
          description: "Podziwiaj wieloryby i delfiny w ich naturalnym środowisku",
          image: "/excursions/whale.jpg",
          duration: "4 godziny",
          groupSize: "Max 12 osób",
          price: "35€",
          rating: 4.9
        },
        {
          title: "Loro Parque",
          description: "Odwiedź jeden z najlepszych ogrodów zoologicznych w Europie",
          image: "/excursions/loro.jpg",
          duration: "6 godzin",
          groupSize: "Max 15 osób",
          price: "40€",
          rating: 4.7
        }
      ]
    }
  }
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<'en' | 'pl'>('en');
  const t = translations[language];

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
      <section style={{
        backgroundImage: 'url("/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }} />
        <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
          <Title order={1} size={rem(60)} c="white" mb="md">
            {t.hero.title}
          </Title>
          <Text size="xl" c="white" mb="xl">
            {t.hero.subtitle}
          </Text>
          
          <Card withBorder p="xl" radius="md" style={{ maxWidth: 600 }}>
            <Tabs defaultValue="accommodation">
              <Tabs.List grow>
                <Tabs.Tab value="accommodation" leftSection={<IconHome size={20} />}>
                  {t.hero.accommodation}
                </Tabs.Tab>
                <Tabs.Tab value="tours" leftSection={<IconMap size={20} />}>
                  {t.hero.tours}
                </Tabs.Tab>
                <Tabs.Tab value="cars" leftSection={<IconCar size={20} />}>
                  {t.hero.cars}
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="accommodation" pt="xl">
                <Text>{t.hero.search} {t.hero.accommodation.toLowerCase()}</Text>
              </Tabs.Panel>

              <Tabs.Panel value="tours" pt="xl">
                <Text>{t.hero.search} {t.hero.tours.toLowerCase()}</Text>
              </Tabs.Panel>

              <Tabs.Panel value="cars" pt="xl">
                <Text>{t.hero.search} {t.hero.cars.toLowerCase()}</Text>
              </Tabs.Panel>
            </Tabs>

            <Button fullWidth size="lg" mt="xl">
              {t.hero.search}
            </Button>
          </Card>
        </Container>
      </section>

      {/* Quick Links Section */}
      <section style={{ padding: '80px 0' }}>
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
            <Card withBorder padding="xl" radius="md">
              <IconHome size={40} />
              <Text size="lg" fw={500} mt="md">{t.quickLinks.apartments}</Text>
            </Card>
            <Card withBorder padding="xl" radius="md">
              <IconMap size={40} />
              <Text size="lg" fw={500} mt="md">{t.quickLinks.tours}</Text>
            </Card>
            <Card withBorder padding="xl" radius="md">
              <IconCar size={40} />
              <Text size="lg" fw={500} mt="md">{t.quickLinks.cars}</Text>
            </Card>
            <Card withBorder padding="xl" radius="md">
              <IconPlane size={40} />
              <Text size="lg" fw={500} mt="md">{t.quickLinks.special}</Text>
            </Card>
          </SimpleGrid>
        </Container>
      </section>

      {/* Top Offers Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#f8f9fa' }}>
        <Container size="xl">
          <Title order={2} mb="xl">{t.topOffers}</Title>
          <Carousel
            withIndicators
            height={400}
            slideSize="33.333333%"
            slideGap="md"
            align="start"
            slidesToScroll={1}
          >
            {/* Add carousel items here */}
          </Carousel>
        </Container>
      </section>

      {/* Interactive Map Section */}
      <section style={{ padding: '80px 0' }}>
        <Container size="xl">
          <Title order={2} mb="xl">{t.map}</Title>
          <Card withBorder p="xl" radius="md">
            <div style={{ height: '500px', backgroundColor: '#f8f9fa' }}>
              {/* Map component will be added here */}
              <Text c="dimmed" ta="center" pt="xl">Map coming soon</Text>
            </div>
          </Card>
        </Container>
      </section>

      {/* Reviews Section */}
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
            {/* Review cards will be added here */}
          </Carousel>
        </Container>
      </section>

      {/* Blog Section */}
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
            {/* Add more blog cards */}
          </SimpleGrid>
        </Container>
      </section>

      {/* Excursions Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#f8f9fa' }}>
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

                <Button fullWidth mt="xl" leftSection={<IconMap size={20} />}>
                  {t.excursions.bookNow}
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#f8f9fa' }}>
        <Container size="xl">
          <Card withBorder padding="xl" radius="md" style={{ textAlign: 'center' }}>
            <Title order={2} mb="md">{t.cta.title}</Title>
            <Text size="lg" mb="xl">{t.cta.subtitle}</Text>
            <Button size="lg" leftSection={<IconPhone size={20} />}>
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
                <Text c="dimmed">+34 XXX XXX XXX</Text>
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

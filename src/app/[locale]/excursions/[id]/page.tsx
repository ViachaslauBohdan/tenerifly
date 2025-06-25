'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Divider,
  Paper,
  ThemeIcon
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { 
  IconClock, 
  IconUsers, 
  IconBrandWhatsapp,
  IconArrowLeft,
  IconCalendar,
  IconMapPin,
  IconPhone,
  IconMail,
  IconLanguage,
  IconStar,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { useTranslation } from '@/hooks/useTranslation';
import { openWhatsApp } from '@/utils/whatsapp';
import { Locale } from '@/types/locale';

interface ExcursionDetailsProps {
  params: Promise<{ locale: Locale; id: string }>;
}

const mockExcursionData = {
  id: '1',
  title: 'Teide National Park Adventure',
  description: 'Experience the majestic Mount Teide, Spain\'s highest peak and a UNESCO World Heritage Site. Enjoy breathtaking views and unique volcanic landscapes in this unforgettable full-day adventure.',
  images: [
    'https://res.cloudinary.com/dlnvckilf/image/upload/v1745227161/roques_de_garcia_pl_61b31e3ebb.webp',
    'https://res.cloudinary.com/dlnvckilf/image/upload/v1745227091/new_File_2_980bf647f4.avif',
    'https://res.cloudinary.com/dlnvckilf/image/upload/v1745227219/G_1cf1604009.webp',
  ],
  price: 45,
  duration: '8 hours',
  maxGroupSize: 8,
  minAge: 6,
  language: 'English, Spanish, Russian',
  difficulty: 'Easy to Moderate',
  category: 'Nature & Adventure',
  highlights: [
    'Visit Spain\'s highest peak at 3,715m',
    'Explore UNESCO World Heritage Site',
    'Breathtaking volcanic landscapes',
    'Cable car ride to the summit',
    'Professional guide commentary',
    'Small group experience'
  ],
  included: [
    'Transportation from pickup point',
    'Professional multilingual guide',
    'Cable car tickets',
    'Lunch at local restaurant',
    'Insurance coverage',
    'Photo stops at scenic viewpoints'
  ],
  notIncluded: [
    'Personal expenses',
    'Gratuities',
    'Additional food and drinks',
    'Optional activities'
  ],
  itinerary: [
    { time: '08:00', activity: 'Pickup from Los Gigantes' },
    { time: '09:30', activity: 'Arrival at Teide National Park' },
    { time: '10:00', activity: 'Cable car ride to summit' },
    { time: '12:00', activity: 'Exploration and photo stops' },
    { time: '13:30', activity: 'Lunch at local restaurant' },
    { time: '15:00', activity: 'Visit Roques de Garcia' },
    { time: '16:30', activity: 'Return journey begins' },
    { time: '18:00', activity: 'Drop-off at pickup point' }
  ],
  meetingPoint: 'Los Gigantes Marina, Main Entrance',
  whatToBring: [
    'Comfortable walking shoes',
    'Warm clothing (summit can be cold)',
    'Sunscreen and sunglasses',
    'Camera',
    'Water bottle',
    'Light jacket'
  ],
  cancellationPolicy: 'Free cancellation up to 24 hours before the tour. 50% refund for cancellations within 24 hours.',
  contact: {
    name: 'Tenerifly Tours',
    phone: '+34656641433',
    email: 'tours@tenerifly.io',
    whatsapp: '+34656641433'
  },
  availability: true,
  rating: 4.8,
  reviews: 156,
  nextAvailableDates: ['2025-01-28', '2025-01-29', '2025-01-30']
};

export default function ExcursionDetailsPage({ params }: ExcursionDetailsProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [excursionId, setExcursionId] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    params.then(({ locale, id }) => {
      setCurrentLocale(locale);
      setExcursionId(id);
    });
  }, [params]);

  if (!mounted) {
    return null;
  }

  const excursion = mockExcursionData;

  return (
    <Container size="xl" py="xl">
      <Button
        variant="light"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.push(`/${currentLocale}/excursions`)}
        mb="xl"
      >
        {t.common.backToHome}
      </Button>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="lg">
            <Group justify="space-between" align="flex-start" mb="md">
              <Title order={1}>{excursion.title}</Title>
              <Badge color="yellow" variant="light" size="lg">
                <Group gap="xs">
                  <IconStar size={14} />
                  {excursion.rating} ({excursion.reviews})
                </Group>
              </Badge>
            </Group>
            
            <Carousel withIndicators height={400} mb="lg">
              {excursion.images.map((image, index) => (
                <Carousel.Slide key={index}>
                  <Image
                    src={image}
                    alt={`${excursion.title} - Image ${index + 1}`}
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
                <Tabs.Tab value="itinerary">Itinerary</Tabs.Tab>
                <Tabs.Tab value="included">What's Included</Tabs.Tab>
                <Tabs.Tab value="details">Details</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="lg">
                <Stack gap="md">
                  <Text size="lg">{excursion.description}</Text>
                  
                  <Title order={3}>Highlights</Title>
                  <List spacing="sm">
                    {excursion.highlights.map((highlight, index) => (
                      <List.Item key={index} icon={
                        <ThemeIcon color="green" size={20} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                      }>
                        {highlight}
                      </List.Item>
                    ))}
                  </List>

                  <Grid mt="md">
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconClock size={20} />
                        <Text fw={500}>{t.sections.excursions.duration}:</Text>
                        <Text>{excursion.duration}</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconUsers size={20} />
                        <Text fw={500}>{t.sections.excursions.groupSize}:</Text>
                        <Text>Max {excursion.maxGroupSize} people</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconLanguage size={20} />
                        <Text fw={500}>{t.sections.excursions.language}:</Text>
                        <Text>{excursion.language}</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconStar size={20} />
                        <Text fw={500}>Difficulty:</Text>
                        <Text>{excursion.difficulty}</Text>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="itinerary" pt="lg">
                <Stack gap="md">
                  {excursion.itinerary.map((item, index) => (
                    <Paper key={index} p="md" withBorder>
                      <Group gap="md">
                        <Badge color="blue" variant="light">{item.time}</Badge>
                        <Text>{item.activity}</Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="included" pt="lg">
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Title order={4} c="green" mb="md">✓ Included</Title>
                    <List spacing="sm">
                      {excursion.included.map((item, index) => (
                        <List.Item key={index} icon={
                          <ThemeIcon color="green" size={20} radius="xl">
                            <IconCheck size={12} />
                          </ThemeIcon>
                        }>
                          {item}
                        </List.Item>
                      ))}
                    </List>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Title order={4} c="red" mb="md">✗ Not Included</Title>
                    <List spacing="sm">
                      {excursion.notIncluded.map((item, index) => (
                        <List.Item key={index} icon={
                          <ThemeIcon color="red" size={20} radius="xl">
                            <IconX size={12} />
                          </ThemeIcon>
                        }>
                          {item}
                        </List.Item>
                      ))}
                    </List>
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>

              <Tabs.Panel value="details" pt="lg">
                <Stack gap="md">
                  <div>
                    <Title order={4} mb="sm">What to Bring</Title>
                    <List spacing="sm">
                      {excursion.whatToBring.map((item, index) => (
                        <List.Item key={index}>{item}</List.Item>
                      ))}
                    </List>
                  </div>

                  <div>
                    <Title order={4} mb="sm">Meeting Point</Title>
                    <Group gap="xs">
                      <IconMapPin size={20} />
                      <Text>{excursion.meetingPoint}</Text>
                    </Group>
                  </div>

                  <div>
                    <Title order={4} mb="sm">Cancellation Policy</Title>
                    <Text size="sm" c="dimmed">{excursion.cancellationPolicy}</Text>
                  </div>
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
                    €{excursion.price} {t.common.per} person
                  </Text>
                  <Badge color="green" variant="light">
                    {excursion.availability ? 'Available' : 'Fully Booked'}
                  </Badge>
                </Stack>
              </Group>

              <Divider />

              <Stack gap="sm">
                <Text fw={500}>Tour Details:</Text>
                <Group justify="space-between">
                  <Text size="sm">Duration:</Text>
                  <Text size="sm" fw={500}>{excursion.duration}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Max Group:</Text>
                  <Text size="sm" fw={500}>{excursion.maxGroupSize} people</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Min Age:</Text>
                  <Text size="sm" fw={500}>{excursion.minAge} years</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Category:</Text>
                  <Text size="sm" fw={500}>{excursion.category}</Text>
                </Group>
              </Stack>

              <Divider />

              <Stack gap="sm">
                <Text fw={500}>Next Available Dates:</Text>
                {excursion.nextAvailableDates.map((date, index) => (
                  <Badge key={index} variant="light" fullWidth>
                    {new Date(date).toLocaleDateString()}
                  </Badge>
                ))}
              </Stack>

              <Divider />

              <Stack gap="sm">
                <Group gap="xs">
                  <IconPhone size={16} />
                  <Text size="sm">{excursion.contact.phone}</Text>
                </Group>
                <Group gap="xs">
                  <IconMail size={16} />
                  <Text size="sm">{excursion.contact.email}</Text>
                </Group>
              </Stack>

              <Button
                fullWidth
                size="lg"
                leftSection={<IconBrandWhatsapp size={20} />}
                color="green"
                onClick={() => openWhatsApp('excursion', {
                  title: excursion.title,
                  duration: excursion.duration,
                  price: `€${excursion.price}`,
                  language: excursion.language
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
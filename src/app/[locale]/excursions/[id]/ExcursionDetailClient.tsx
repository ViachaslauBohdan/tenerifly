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
  Divider,
  Paper,
  ThemeIcon,
  ActionIcon,
  Anchor
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
  IconX,
  IconShare
} from '@tabler/icons-react';
import { useTranslation } from '@/hooks/useTranslation';
import { openWhatsApp } from '@/utils/whatsapp';
import { toursAPI } from '@/services/api';
import { Tour } from '@/types/strapi';
import { Locale } from '@/types/locale';

interface ExcursionDetailClientProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export function ExcursionDetailClient({ params }: ExcursionDetailClientProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [excursionId, setExcursionId] = useState<string>('');
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    params.then(({ locale, id }) => {
      setCurrentLocale(locale);
      setExcursionId(id);
    });
  }, [params]);

  useEffect(() => {
    const fetchTour = async () => {
      if (!excursionId || !currentLocale) return;
      
      try {
        setLoading(true);
        const response = await toursAPI.getById(parseInt(excursionId), currentLocale);
        setTour(response.data);
      } catch (err) {
        setError('Экскурсия не найдена');
        console.error('Error fetching tour:', err);
      } finally {
        setLoading(false);
      }
    };

    if (mounted && excursionId && currentLocale) {
      fetchTour();
    }
  }, [mounted, excursionId, currentLocale]);

  if (!mounted || loading) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center">Загрузка...</Text>
      </Container>
    );
  }

  if (error || !tour) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center" c="red">{error || 'Экскурсия не найдена'}</Text>
        <Group justify="center" mt="md">
          <Button onClick={() => router.push(`/${currentLocale}/excursions`)}>
            Вернуться к экскурсиям
          </Button>
        </Group>
      </Container>
    );
  }

  const shareUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Container size="xl" py="xl">
      <Button
        variant="light"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.push(`/${currentLocale}/excursions`)}
        mb="xl"
      >
        Вернуться к экскурсиям
      </Button>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="lg">
            <Group justify="space-between" align="flex-start" mb="md">
              <Title order={1}>{tour.title}</Title>
              <Group gap="xs">
                <ActionIcon variant="light" onClick={shareUrl}>
                  <IconShare size={16} />
                </ActionIcon>
                <Badge color="yellow" variant="light" size="lg">
                  <Group gap="xs">
                    <IconStar size={14} />
                    {tour.rating || 5.0} ({tour.reviews_count || 0})
                  </Group>
                </Badge>
              </Group>
            </Group>
            
            {/* Галерея изображений */}
            <Carousel withIndicators height={400} mb="lg">
              {tour.images && tour.images.length > 0 ? (
                tour.images.map((image, index: number) => (
                  <Carousel.Slide key={index}>
                    <Image
                      src={image.url}
                      alt={`${tour.title} - Изображение ${index + 1}`}
                      height={400}
                      fit="cover"
                      radius="md"
                    />
                  </Carousel.Slide>
                ))
              ) : (
                <Carousel.Slide>
                  <Image
                    src="/placeholder.jpg"
                    alt={tour.title}
                    height={400}
                    fit="cover"
                    radius="md"
                  />
                </Carousel.Slide>
              )}
            </Carousel>

            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview">Обзор</Tabs.Tab>
                <Tabs.Tab value="itinerary">Программа</Tabs.Tab>
                <Tabs.Tab value="included">Что включено</Tabs.Tab>
                <Tabs.Tab value="details">Детали</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="lg">
                <Stack gap="md">
                  <Text size="lg">{tour.description}</Text>
                  
                  {tour.highlights && tour.highlights.length > 0 && (
                    <>
                      <Title order={3}>Особенности</Title>
                      <List spacing="sm">
                        {tour.highlights.map((highlight: string, index: number) => (
                          <List.Item key={index} icon={
                            <ThemeIcon color="green" size={20} radius="xl">
                              <IconCheck size={12} />
                            </ThemeIcon>
                          }>
                            {highlight}
                          </List.Item>
                        ))}
                      </List>
                    </>
                  )}

                  <Grid mt="md">
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconClock size={20} />
                        <Text fw={500}>Продолжительность:</Text>
                        <Text>{tour.duration}</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconUsers size={20} />
                        <Text fw={500}>Макс. участников:</Text>
                        <Text>{tour.max_participants || 20} человек</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconLanguage size={20} />
                        <Text fw={500}>Языки:</Text>
                        <Text>{tour.guide_languages?.join(', ') || 'Русский, Английский'}</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconStar size={20} />
                        <Text fw={500}>Сложность:</Text>
                        <Text>{tour.difficulty_level || 'Легкая'}</Text>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="itinerary" pt="lg">
                <Text>Подробная программа экскурсии будет предоставлена при бронировании</Text>
              </Tabs.Panel>

              <Tabs.Panel value="included" pt="lg">
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Title order={4} c="green" mb="md">✓ Включено</Title>
                    <List spacing="sm">
                      {tour.includes_transport && (
                        <List.Item icon={
                          <ThemeIcon color="green" size={20} radius="xl">
                            <IconCheck size={12} />
                          </ThemeIcon>
                        }>
                          Трансфер
                        </List.Item>
                      )}
                      {tour.includes_food && (
                        <List.Item icon={
                          <ThemeIcon color="green" size={20} radius="xl">
                            <IconCheck size={12} />
                          </ThemeIcon>
                        }>
                          Питание
                        </List.Item>
                      )}
                      {tour.includes_tickets && (
                        <List.Item icon={
                          <ThemeIcon color="green" size={20} radius="xl">
                            <IconCheck size={12} />
                          </ThemeIcon>
                        }>
                          Входные билеты
                        </List.Item>
                      )}
                      <List.Item icon={
                        <ThemeIcon color="green" size={20} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                      }>
                        Профессиональный гид
                      </List.Item>
                    </List>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Title order={4} c="red" mb="md">✗ Не включено</Title>
                    <List spacing="sm">
                      <List.Item icon={
                        <ThemeIcon color="red" size={20} radius="xl">
                          <IconX size={12} />
                        </ThemeIcon>
                      }>
                        Личные расходы
                      </List.Item>
                      <List.Item icon={
                        <ThemeIcon color="red" size={20} radius="xl">
                          <IconX size={12} />
                        </ThemeIcon>
                      }>
                        Чаевые
                      </List.Item>
                      {!tour.includes_food && (
                        <List.Item icon={
                          <ThemeIcon color="red" size={20} radius="xl">
                            <IconX size={12} />
                          </ThemeIcon>
                        }>
                          Дополнительные напитки и еда
                        </List.Item>
                      )}
                    </List>
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>

              <Tabs.Panel value="details" pt="lg">
                <Stack gap="md">
                  {tour.what_to_bring && tour.what_to_bring.length > 0 && (
                    <div>
                      <Title order={4} mb="sm">Что взять с собой</Title>
                      <List spacing="sm">
                        {tour.what_to_bring.map((item: string, index: number) => (
                          <List.Item key={index}>{item}</List.Item>
                        ))}
                      </List>
                    </div>
                  )}

                  {tour.meeting_point && (
                    <div>
                      <Title order={4} mb="sm">Место встречи</Title>
                      <Group gap="xs">
                        <IconMapPin size={20} />
                        <Text>{tour.meeting_point}</Text>
                      </Group>
                    </div>
                  )}

                  {tour.cancellation_policy && (
                    <div>
                      <Title order={4} mb="sm">Политика отмены</Title>
                      <Text size="sm" c="dimmed">{tour.cancellation_policy}</Text>
                    </div>
                  )}
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Grid.Col>

        {/* Боковая панель с бронированием */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="lg" pos="sticky" style={{ top: 20 }}>
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs">
                  <Text size="xl" fw={700} c="blue">
                    €{tour.price?.amount || 0} на человека
                  </Text>
                  <Badge color="green" variant="light">
                    Доступно для бронирования
                  </Badge>
                </Stack>
              </Group>

              <Divider />

              <Stack gap="sm">
                <Text fw={500}>Детали тура:</Text>
                <Group justify="space-between">
                  <Text size="sm">Продолжительность:</Text>
                  <Text size="sm" fw={500}>{tour.duration}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Макс. группа:</Text>
                  <Text size="sm" fw={500}>{tour.max_participants || 20} человек</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Мин. возраст:</Text>
                  <Text size="sm" fw={500}>{tour.min_age || 0} лет</Text>
                </Group>
                {tour.category && (
                  <Group justify="space-between">
                    <Text size="sm">Категория:</Text>
                    <Text size="sm" fw={500}>{tour.category}</Text>
                  </Group>
                )}
              </Stack>

              <Divider />

              {tour.contact && (
                <Stack gap="sm">
                  {tour.contact.phone && (
                    <Group gap="xs">
                      <IconPhone size={16} />
                      <Text size="sm">{tour.contact.phone}</Text>
                    </Group>
                  )}
                  {tour.contact.email && (
                    <Group gap="xs">
                      <IconMail size={16} />
                      <Text size="sm">{tour.contact.email}</Text>
                    </Group>
                  )}
                </Stack>
              )}

              <Button
                fullWidth
                size="lg"
                leftSection={<IconBrandWhatsapp size={20} />}
                color="green"
                onClick={() => openWhatsApp('excursion', {
                  title: tour.title,
                  duration: tour.duration,
                  price: `€${tour.price?.amount || 0}`,
                  language: tour.guide_languages?.join(', ') || 'Русский'
                }, currentLocale)}
              >
                Забронировать сейчас
              </Button>

              <Button
                fullWidth
                variant="light"
                leftSection={<IconCalendar size={20} />}
              >
                Проверить доступность
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
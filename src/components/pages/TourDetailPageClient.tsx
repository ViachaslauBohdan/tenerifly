'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, Image, Badge, Button, Group, Stack, Paper, LoadingOverlay, Alert, Card, List, Divider, rem, Rating } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconAlertCircle, IconMapPin, IconClock, IconUsers, IconPhone, IconBabyCarriage } from '@tabler/icons-react';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { toursAPI } from '@/services/api';
import { Tour } from '@/types/strapi';
import { Locale } from '@/types/locale';

interface TourDetailPageClientProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export function TourDetailPageClient({ params }: TourDetailPageClientProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [tourId, setTourId] = useState<number>(0);
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Обработка монтирования компонента
  useEffect(() => {
    setMounted(true);
  }, []);

  // Обработка изменения параметров
  useEffect(() => {
    params.then((resolvedParams) => {
      setCurrentLocale(resolvedParams.locale);
      setTourId(parseInt(resolvedParams.id));
    });
  }, [params]);

  // Загрузка данных экскурсии
  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId || !currentLocale) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await toursAPI.getById(tourId, currentLocale);
        setTour(response.data);
      } catch (err) {
        console.error('Ошибка загрузки экскурсии:', err);
        setError('Экскурсия не найдена');
        setTour(null);
      } finally {
        setLoading(false);
      }
    };

    if (mounted && tourId && currentLocale) {
      fetchTour();
    }
  }, [mounted, tourId, currentLocale]);

  if (!mounted) {
    return <LoadingOverlay visible />;
  }

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <BackToHome />
        <LoadingOverlay visible />
      </Container>
    );
  }

  if (error || !tour) {
    return (
      <Container size="xl" py="xl">
        <BackToHome />
        <Alert icon={<IconAlertCircle size={16} />} title="Ошибка" color="red">
          {error || 'Экскурсия не найдена'}
        </Alert>
      </Container>
    );
  }

  const difficultyLabels = {
    easy: 'Легкий',
    moderate: 'Средний',
    hard: 'Сложный'
  };

  const difficultyColors = {
    easy: 'green',
    moderate: 'yellow',
    hard: 'red'
  };

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      
      <Grid>
        {/* Основная информация */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="xl">
            {/* Заголовок */}
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Title order={1} size={rem(36)} fw={900} className="gradient-text">
                  {tour.title}
                </Title>
                <Group>
                  <Badge color={difficultyColors[tour.difficulty_level || 'easy']} size="lg">
                    {difficultyLabels[tour.difficulty_level || 'easy']}
                  </Badge>
                  {tour.suitable_for_children && (
                    <Badge color="pink" size="lg" leftSection={<IconBabyCarriage size={14} />}>
                      Для детей
                    </Badge>
                  )}
                  {tour.featured && (
                    <Badge color="orange" size="lg">
                      Рекомендуемая
                    </Badge>
                  )}
                </Group>
              </Stack>
            </Group>

            {/* Рейтинг */}
            {tour.rating && (
              <Group gap="xs">
                <Rating value={tour.rating} readOnly />
                <Text size="sm" c="dimmed">
                  {tour.rating.toFixed(1)} из 5
                </Text>
                {tour.reviews_count && (
                  <Text size="sm" c="dimmed">
                    ({tour.reviews_count} отзывов)
                  </Text>
                )}
              </Group>
            )}

            {/* Галерея изображений */}
            {tour.images && tour.images.length > 0 && (
              <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
                {tour.images.length === 1 ? (
                  <Image
                    src={tour.images[0].url}
                    alt={tour.title}
                    height={400}
                    fallbackSrc="/placeholder.jpg"
                  />
                ) : (
                  <Carousel withIndicators height={400}>
                    {tour.images.map((image, index) => (
                      <Carousel.Slide key={index}>
                        <Image
                          src={image.url}
                          alt={`${tour.title} - фото ${index + 1}`}
                          height={400}
                          fallbackSrc="/placeholder.jpg"
                        />
                      </Carousel.Slide>
                    ))}
                  </Carousel>
                )}
              </Paper>
            )}

            {/* Описание */}
            <Card withBorder>
              <Title order={3} mb="md">Описание</Title>
              <Text>
                {tour.description || tour.short_description || 'Описание не указано'}
              </Text>
            </Card>

            {/* Основная информация */}
            <Card withBorder>
              <Title order={3} mb="md">Информация о туре</Title>
              <Grid>
                <Grid.Col span={6}>
                  <Group gap="xs">
                    <IconClock size={16} />
                    <Text size="sm">
                      <strong>Продолжительность:</strong> {tour.duration}
                    </Text>
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Group gap="xs">
                    <IconUsers size={16} />
                    <Text size="sm">
                      <strong>Макс. участников:</strong> {tour.max_participants || 'Не ограничено'}
                    </Text>
                  </Group>
                </Grid.Col>
                {tour.min_age && (
                  <Grid.Col span={6}>
                    <Text size="sm">
                      <strong>Мин. возраст:</strong> {tour.min_age} лет
                    </Text>
                  </Grid.Col>
                )}
                {tour.guide_languages && tour.guide_languages.length > 0 && (
                  <Grid.Col span={6}>
                    <Text size="sm">
                      <strong>Языки гида:</strong> {tour.guide_languages.join(', ')}
                    </Text>
                  </Grid.Col>
                )}
              </Grid>
            </Card>
          </Stack>
        </Grid.Col>

        {/* Боковая панель */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            {/* Цена и бронирование */}
            <Card withBorder p="lg" className="glass-effect">
              <Stack gap="md">
                <Title order={3} ta="center">Стоимость</Title>
                
                <Text size="xl" fw={700} ta="center" c="blue.6">
                  €{tour.price?.amount || 'По запросу'}
                </Text>
                <Text size="sm" ta="center" c="dimmed">
                  за человека
                </Text>

                <Divider />

                <Button
                  fullWidth
                  size="lg"
                  leftSection={<IconPhone size={18} />}
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  onClick={() => console.log('Забронировать экскурсию:', tour.id)}
                >
                  Забронировать
                </Button>
              </Stack>
            </Card>

            {/* Информация о локации */}
            {tour.location && (
              <Card withBorder p="md" className="glass-effect">
                <Title order={4} mb="md">
                  <IconMapPin size={18} style={{ display: 'inline', marginRight: 8 }} />
                  Местоположение
                </Title>
                <Text size="sm">
                  {tour.location.city}, {tour.location.address}
                </Text>
              </Card>
            )}

            {/* Контактная информация */}
            {tour.contact && (
              <Card withBorder p="md" className="glass-effect">
                <Title order={4} mb="md">Контакты</Title>
                <Stack gap="xs">
                  {tour.contact.phone && (
                    <Text size="sm">
                      <strong>Телефон:</strong> {tour.contact.phone}
                    </Text>
                  )}
                  {tour.contact.email && (
                    <Text size="sm">
                      <strong>Email:</strong> {tour.contact.email}
                    </Text>
                  )}
                  {tour.contact.whatsapp && (
                    <Text size="sm">
                      <strong>WhatsApp:</strong> {tour.contact.whatsapp}
                    </Text>
                  )}
                </Stack>
              </Card>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
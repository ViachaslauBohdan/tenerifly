'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, Image, Badge, Button, Group, Stack, Paper, LoadingOverlay, Alert, Card, List, Divider, rem } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconAlertCircle, IconCar, IconUsers, IconGasStation, IconSettings, IconPhone, IconMapPin } from '@tabler/icons-react';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { carsAPI } from '@/services/api';
import { Car } from '@/types/strapi'; 
import { Locale } from '@/types/locale';

interface CarDetailPageClientProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export function CarDetailPageClient({ params }: CarDetailPageClientProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [carId, setCarId] = useState<string>('');
  
  const [car, setCar] = useState<Car | null>(null);
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
      setCarId(resolvedParams.id); 
    });
  }, [params]);

  // Загрузка данных автомобиля
  useEffect(() => {
    const fetchCar = async () => {
      if (!carId || !currentLocale) return;

      try {
        setLoading(true);
        setError(null);

        // Используем carId как string, не преобразуем в число
        const response = await carsAPI.getById(carId, currentLocale);
        setCar(response.data);
        console.log('Loaded car:', response.data);
      } catch (err) {
        console.error('Ошибка загрузки автомобиля:', err);
        setError('Автомобиль не найден');
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    if (mounted && carId && currentLocale) {
      fetchCar();
    }
  }, [mounted, carId, currentLocale]);

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

  if (error || !car) {
    return (
      <Container size="xl" py="xl">
        <BackToHome />
        <Alert icon={<IconAlertCircle size={16} />} title="Ошибка" color="red">
          {error || 'Автомобиль не найден'}
        </Alert>
      </Container>
    );
  }

  const typeLabels = {
    rent: 'Аренда',
    sale: 'Продажа'
  };

  const statusLabels = {
    available: 'Доступен',
    reserved: 'Забронирован',
    sold: 'Продан',
    maintenance: 'На обслуживании'
  };

  const statusColors = {
    available: 'green',
    reserved: 'yellow',
    sold: 'red',
    maintenance: 'gray'
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
                  {car.title}
                </Title>
                <Group>
                  <Badge color={car.type === 'rent' ? 'blue' : 'green'} size="lg">
                    {typeLabels[car.type]}
                  </Badge>
                  <Badge color={statusColors[car.car_status]} size="lg">
                    {statusLabels[car.car_status]}
                  </Badge>
                  {car.featured && (
                    <Badge color="orange" size="lg">
                      Рекомендуемый
                    </Badge>
                  )}
                </Group>
              </Stack>
            </Group>

            {/* Галерея изображений */}
            {car.images && car.images.length > 0 && (
              <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
                {car.images.length === 1 ? (
                  <Image
                    src={car.images[0].url}
                    alt={car.title}
                    height={400}
                    fallbackSrc="/placeholder.jpg"
                  />
                ) : (
                  <Carousel withIndicators height={400}>
                    {car.images.map((image, index) => (
                      <Carousel.Slide key={index}>
                        <Image
                          src={image.url}
                          alt={`${car.title} - фото ${index + 1}`}
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
                {car.description || car.short_description || 'Описание не указано'}
              </Text>
            </Card>

            {/* Технические характеристики */}
            {car.specifications && (
              <Card withBorder>
                <Title order={3} mb="md">Технические характеристики</Title>
                <Grid>
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <IconCar size={16} />
                      <Text size="sm">
                        <strong>Марка и модель:</strong> {car.specifications.make} {car.specifications.model}
                      </Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="sm">
                      <strong>Год выпуска:</strong> {car.specifications.year}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <IconGasStation size={16} />
                      <Text size="sm">
                        <strong>Топливо:</strong> {car.specifications.fuel}
                      </Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <IconSettings size={16} />
                      <Text size="sm">
                        <strong>КПП:</strong> {car.specifications.transmission}
                      </Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <IconUsers size={16} />
                      <Text size="sm">
                        <strong>Количество мест:</strong> {car.specifications.seats}
                      </Text>
                    </Group>
                  </Grid.Col>
                  {car.specifications.mileage && (
                    <Grid.Col span={6}>
                      <Text size="sm">
                        <strong>Пробег:</strong> {car.specifications.mileage.toLocaleString()} км
                      </Text>
                    </Grid.Col>
                  )}
                </Grid>
              </Card>
            )}

            {/* Дополнительные возможности */}
            {car.features && (
              <Card withBorder>
                <Title order={3} mb="md">Дополнительные возможности</Title>
                <List spacing="xs" size="sm">
                  {car.features.air_conditioning && <List.Item>Кондиционер</List.Item>}
                  {car.features.navigation && <List.Item>Навигационная система</List.Item>}
                  {car.features.bluetooth && <List.Item>Bluetooth</List.Item>}
                  {car.features.parking_sensors && <List.Item>Парктроник</List.Item>}
                </List>
              </Card>
            )}
          </Stack>
        </Grid.Col>

        {/* Боковая панель */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            {/* Цена и условия */}
            <Card withBorder p="lg" className="glass-effect">
              <Stack gap="md">
                <Title order={3} ta="center">Стоимость</Title>
                
                {car.type === 'rent' && car.rental_prices ? (
                  <Stack gap="sm">
                    {car.rental_prices.day_1 && (
                      <Group justify="space-between">
                        <Text>1 день:</Text>
                        <Text fw={700} c="blue.6">€{car.rental_prices.day_1}</Text>
                      </Group>
                    )}
                    {car.rental_prices.day_7 && (
                      <Group justify="space-between">
                        <Text>7 дней:</Text>
                        <Text fw={700} c="blue.6">€{car.rental_prices.day_7}</Text>
                      </Group>
                    )}
                    {car.rental_prices.month && (
                      <Group justify="space-between">
                        <Text>Месяц:</Text>
                        <Text fw={700} c="blue.6">€{car.rental_prices.month}</Text>
                      </Group>
                    )}
                  </Stack>
                ) : (
                  <Text size="xl" fw={700} ta="center" c="blue.6">
                    €{car.price?.amount || 'По запросу'}
                  </Text>
                )}

                <Divider />

                <Button
                  fullWidth
                  size="lg"
                  leftSection={<IconPhone size={18} />}
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  onClick={() => console.log('Связаться по автомобилю:', car.id)}
                >
                  Связаться
                </Button>
              </Stack>
            </Card>

            {/* Информация о локации */}
            {car.location && (
              <Card withBorder p="md" className="glass-effect">
                <Title order={4} mb="md">
                  <IconMapPin size={18} style={{ display: 'inline', marginRight: 8 }} />
                  Местоположение
                </Title>
                <Text size="sm">
                  {car.location.city}, {car.location.address}
                </Text>
              </Card>
            )}

            {/* Условия аренды */}
            {car.type === 'rent' && car.rental_terms && (
              <Card withBorder p="md" className="glass-effect">
                <Title order={4} mb="md">Условия аренды</Title>
                <Stack gap="xs">
                  <Text size="sm">
                    <strong>Минимальный период:</strong> {car.rental_terms.min_rental_period} дн.
                  </Text>
                </Stack>
              </Card>
            )}

            {/* Контактная информация */}
            {car.contact && (
              <Card withBorder p="md" className="glass-effect">
                <Title order={4} mb="md">Контакты</Title>
                <Stack gap="xs">
                  {car.contact.phone && (
                    <Text size="sm">
                      <strong>Телефон:</strong> {car.contact.phone}
                    </Text>
                  )}
                  {car.contact.email && (
                    <Text size="sm">
                      <strong>Email:</strong> {car.contact.email}
                    </Text>
                  )}
                  {car.contact.whatsapp && (
                    <Text size="sm">
                      <strong>WhatsApp:</strong> {car.contact.whatsapp}
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
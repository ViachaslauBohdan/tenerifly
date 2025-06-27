'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Grid, 
  Card, 
  Image, 
  Badge, 
  Group, 
  Stack, 
  Text, 
  Button,
  SimpleGrid,
  Select,
  TextInput,
  NumberInput,
  Checkbox,
  Tabs
} from '@mantine/core';
import { 
  IconBed, 
  IconBath, 
  IconRuler, 
  IconMapPin, 
  IconCar,
  IconBrandWhatsapp,
  IconSearch,
  IconFilter,
  IconEye
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { openWhatsApp } from '@/utils/whatsapp';
import { propertiesAPI } from '@/services/api';
import { Property } from '@/types/strapi';
import { Locale } from '@/types/locale';
import { BackToHome } from '@/components/BackToHome';

interface AccommodationPageContentProps {
  params: Promise<{ locale: Locale }>;
}

interface PropertyFilters {
  city: string;
  propertyType: string;
  minPrice: number | '';
  maxPrice: number | '';
  bedrooms: string;
  bathrooms: string;
  minArea: number | '';
  maxArea: number | '';
  furnished: boolean | null;
  hasParking: boolean | null;
  hasPool: boolean | null;
  hasGarden: boolean | null;
  hasTerrace: boolean | null;
}

export function AccommodationPageContent({ params }: AccommodationPageContentProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<PropertyFilters>({
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    furnished: null,
    hasParking: null,
    hasPool: null,
    hasGarden: null,
    hasTerrace: null,
  });

  useEffect(() => {
    setMounted(true);
    params.then(({ locale }) => {
      setCurrentLocale(locale);
    });
  }, [params]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!currentLocale) return;
      
      try {
        setLoading(true);
        const response = await propertiesAPI.getAll(currentLocale);
        setProperties(response.data || []);
      } catch (err) {
        setError('Не удалось загрузить недвижимость');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    if (mounted && currentLocale) {
      fetchProperties();
    }
  }, [mounted, currentLocale]);

  const getCategoryLabel = (category: Property['category']) => {
    const labels: Record<Property['category'], string> = {
      apartment: 'Квартира',
      house: 'Дом',
      villa: 'Вилла',
      penthouse: 'Пентхаус',
      studio: 'Студия',
      commercial: 'Коммерческая',
      land: 'Участок',
      building: 'Здание',
    };
    return labels[category] || category;
  };

  const getStatusColor = (status: Property['property_status']) => {
    const colors: Record<Property['property_status'], string> = {
      available: 'green',
      reserved: 'yellow',
      sold: 'red',
      under_contract: 'orange',
    };
    return colors[status];
  };

  const getStatusLabel = (status: Property['property_status']) => {
    const labels: Record<Property['property_status'], string> = {
      available: 'Доступно',
      reserved: 'Забронировано',
      sold: 'Продано',
      under_contract: 'Под договором',
    };
    return labels[status];
  };

  const filteredProperties = properties.filter(property => {
    if (filters.city && !property.location?.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    if (filters.propertyType && property.category !== filters.propertyType) {
      return false;
    }
    if (filters.minPrice && typeof filters.minPrice === 'number' && property.price.amount < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && typeof filters.maxPrice === 'number' && property.price.amount > filters.maxPrice) {
      return false;
    }
    if (filters.bedrooms && property.specifications?.bedrooms !== parseInt(filters.bedrooms)) {
      return false;
    }
    if (filters.bathrooms && property.specifications?.bathrooms !== parseInt(filters.bathrooms)) {
      return false;
    }
    if (filters.minArea && typeof filters.minArea === 'number' && (property.specifications?.total_area || 0) < filters.minArea) {
      return false;
    }
    if (filters.maxArea && typeof filters.maxArea === 'number' && (property.specifications?.total_area || 0) > filters.maxArea) {
      return false;
    }
    if (filters.furnished !== null && property.specifications?.furnished !== filters.furnished) {
      return false;
    }
    if (filters.hasParking !== null && property.features?.garage !== filters.hasParking) {
      return false;
    }
    if (filters.hasPool !== null && property.features?.pool !== filters.hasPool) {
      return false;
    }
    if (filters.hasGarden !== null && property.features?.garden !== filters.hasGarden) {
      return false;
    }
    if (filters.hasTerrace !== null && property.features?.terrace !== filters.hasTerrace) {
      return false;
    }
    return true;
  });

  const featuredProperties = filteredProperties.filter(property => property.featured);
  const regularProperties = filteredProperties.filter(property => !property.featured);

  if (!mounted || loading) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center">Загрузка...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center" c="red">{error}</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      
      <Title order={1} mb="xl" ta="center" className="gradient-text">
        Недвижимость на Тенерифе
      </Title>

      {/* Фильтры */}
      <Card withBorder mb="xl" className="glass-effect">
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">Поиск недвижимости</Text>
          <Button
            variant="light"
            leftSection={<IconFilter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" mb="md">
          <TextInput
            placeholder="Город"
            leftSection={<IconMapPin size={16} />}
            value={filters.city}
            onChange={(e) => setFilters({...filters, city: e.target.value})}
          />
          <Select
            placeholder="Тип недвижимости"
            data={[
              { value: 'apartment', label: 'Квартира' },
              { value: 'house', label: 'Дом' },
              { value: 'villa', label: 'Вилла' },
              { value: 'penthouse', label: 'Пентхаус' },
              { value: 'studio', label: 'Студия' },
              { value: 'commercial', label: 'Коммерческая' },
              { value: 'land', label: 'Участок' },
            ]}
            value={filters.propertyType}
            onChange={(value) => setFilters({...filters, propertyType: value || ''})}
          />
          <Group grow>
            <NumberInput
              placeholder="Цена от"
              min={0}
              value={filters.minPrice}
              onChange={(value) => setFilters({...filters, minPrice: typeof value === 'number' ? value : ''})}
            />
            <NumberInput
              placeholder="Цена до"
              min={0}
              value={filters.maxPrice}
              onChange={(value) => setFilters({...filters, maxPrice: typeof value === 'number' ? value : ''})}
            />
          </Group>
        </SimpleGrid>

        {showFilters && (
          <Tabs defaultValue="basic">
            <Tabs.List>
              <Tabs.Tab value="basic">Основные</Tabs.Tab>
              <Tabs.Tab value="features">Удобства</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="basic" pt="md">
              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
                <Select
                  placeholder="Спальни"
                  data={[
                    { value: '1', label: '1 спальня' },
                    { value: '2', label: '2 спальни' },
                    { value: '3', label: '3 спальни' },
                    { value: '4', label: '4+ спальни' },
                  ]}
                  value={filters.bedrooms}
                  onChange={(value) => setFilters({...filters, bedrooms: value || ''})}
                />
                <Select
                  placeholder="Ванные"
                  data={[
                    { value: '1', label: '1 ванная' },
                    { value: '2', label: '2 ванные' },
                    { value: '3', label: '3+ ванные' },
                  ]}
                  value={filters.bathrooms}
                  onChange={(value) => setFilters({...filters, bathrooms: value || ''})}
                />
                <NumberInput
                  placeholder="Площадь от, м²"
                  min={0}
                  value={filters.minArea}
                  onChange={(value) => setFilters({...filters, minArea: typeof value === 'number' ? value : ''})}
                />
                <NumberInput
                  placeholder="Площадь до, м²"
                  min={0}
                  value={filters.maxArea}
                  onChange={(value) => setFilters({...filters, maxArea: typeof value === 'number' ? value : ''})}
                />
              </SimpleGrid>
            </Tabs.Panel>

            <Tabs.Panel value="features" pt="md">
              <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="md">
                <Checkbox
                  label="Меблировано"
                  checked={filters.furnished === true}
                  onChange={(e) => setFilters({...filters, furnished: e.target.checked ? true : null})}
                />
                <Checkbox
                  label="Парковка"
                  checked={filters.hasParking === true}
                  onChange={(e) => setFilters({...filters, hasParking: e.target.checked ? true : null})}
                />
                <Checkbox
                  label="Бассейн"
                  checked={filters.hasPool === true}
                  onChange={(e) => setFilters({...filters, hasPool: e.target.checked ? true : null})}
                />
                <Checkbox
                  label="Сад"
                  checked={filters.hasGarden === true}
                  onChange={(e) => setFilters({...filters, hasGarden: e.target.checked ? true : null})}
                />
                <Checkbox
                  label="Терраса"
                  checked={filters.hasTerrace === true}
                  onChange={(e) => setFilters({...filters, hasTerrace: e.target.checked ? true : null})}
                />
              </SimpleGrid>
            </Tabs.Panel>
          </Tabs>
        )}
      </Card>

      {/* Рекомендуемые объекты */}
      {featuredProperties.length > 0 && (
        <>
          <Title order={2} mb="lg">⭐ Рекомендуемые объекты</Title>
          <Grid mb="xl">
            {featuredProperties.map((property) => (
              <Grid.Col key={property.id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card withBorder radius="xl" h="100%" className="glass-effect">
                  <Card.Section>
                    <Image
                      src={property.images?.[0]?.url || '/placeholder.jpg'}
                      height={200}
                      alt={property.title}
                    />
                  </Card.Section>

                  <Stack mt="md" h="100%" justify="space-between">
                    <div>
                      <Group justify="space-between" mb="xs">
                        <Badge color={getStatusColor(property.property_status)} variant="light">
                          {getStatusLabel(property.property_status)}
                        </Badge>
                        <Badge color="blue" variant="gradient">
                          {getCategoryLabel(property.category)}
                        </Badge>
                      </Group>

                      <Title order={3} size="h4" mb="md" lineClamp={2}>
                        {property.title}
                      </Title>

                      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                        {property.description}
                      </Text>

                      <SimpleGrid cols={3} spacing="xs" mb="md">
                        <Group gap="xs">
                          <IconBed size={16} />
                          <Text size="sm">{property.specifications?.bedrooms || 0}</Text>
                        </Group>
                        <Group gap="xs">
                          <IconBath size={16} />
                          <Text size="sm">{property.specifications?.bathrooms || 0}</Text>
                        </Group>
                        <Group gap="xs">
                          <IconRuler size={16} />
                          <Text size="sm">{property.specifications?.total_area || 0}м²</Text>
                        </Group>
                      </SimpleGrid>

                      {property.location && (
                        <Group gap="xs" mb="md">
                          <IconMapPin size={16} />
                          <Text size="sm" lineClamp={1}>{property.location.city}</Text>
                        </Group>
                      )}
                    </div>

                    <div>
                      <Text size="xl" fw={700} c="blue" mb="md">
                        €{property.price?.amount || 0}
                        {property.price?.period === 'month' ? '/мес' : 
                         property.price?.period === 'day' ? '/день' : ''}
                      </Text>

                      <Group>
                        <Button
                          flex={1}
                          leftSection={<IconEye size={16} />}
                          onClick={() => router.push(`/${currentLocale}/accommodation/${property.id}`)}
                        >
                          Подробнее
                        </Button>
                        <Button
                          variant="light"
                          leftSection={<IconBrandWhatsapp size={16} />}
                          color="green"
                          onClick={() => openWhatsApp('accommodation', {
                            title: property.title,
                            price: `€${property.price?.amount || 0}`
                          }, currentLocale)}
                        >
                          WhatsApp
                        </Button>
                      </Group>
                    </div>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </>
      )}

      {/* Все объекты */}
      <Title order={2} mb="lg">Все объекты недвижимости</Title>
      <Text mb="md" c="dimmed">Найдено: {filteredProperties.length} объектов</Text>
      
      <Grid>
        {regularProperties.map((property) => (
          <Grid.Col key={property.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card withBorder radius="xl" h="100%" className="glass-effect">
              <Card.Section>
                <Image
                  src={property.images?.[0]?.url || '/placeholder.jpg'}
                  height={200}
                  alt={property.title}
                />
              </Card.Section>

              <Stack mt="md" h="100%" justify="space-between">
                <div>
                  <Group justify="space-between" mb="xs">
                    <Badge color={getStatusColor(property.property_status)} variant="light">
                      {getStatusLabel(property.property_status)}
                    </Badge>
                    <Badge color="gray" variant="light">
                      {getCategoryLabel(property.category)}
                    </Badge>
                  </Group>

                  <Title order={3} size="h4" mb="md" lineClamp={2}>
                    {property.title}
                  </Title>

                  <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                    {property.description}
                  </Text>

                  <SimpleGrid cols={3} spacing="xs" mb="md">
                    <Group gap="xs">
                      <IconBed size={16} />
                      <Text size="sm">{property.specifications?.bedrooms || 0}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconBath size={16} />
                      <Text size="sm">{property.specifications?.bathrooms || 0}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconRuler size={16} />
                      <Text size="sm">{property.specifications?.total_area || 0}м²</Text>
                    </Group>
                  </SimpleGrid>

                  {property.location && (
                    <Group gap="xs" mb="md">
                      <IconMapPin size={16} />
                      <Text size="sm" lineClamp={1}>{property.location.city}</Text>
                    </Group>
                  )}
                </div>

                <div>
                  <Text size="xl" fw={700} c="blue" mb="md">
                    €{property.price?.amount || 0}
                    {property.price?.period === 'month' ? '/мес' : 
                     property.price?.period === 'day' ? '/день' : ''}
                  </Text>

                  <Group>
                    <Button
                      flex={1}
                      leftSection={<IconEye size={16} />}
                      onClick={() => router.push(`/${currentLocale}/accommodation/${property.id}`)}
                    >
                      Подробнее
                    </Button>
                    <Button
                      variant="light"
                      leftSection={<IconBrandWhatsapp size={16} />}
                      color="green"
                      onClick={() => openWhatsApp('accommodation', {
                        title: property.title,
                        price: `€${property.price?.amount || 0}`
                      }, currentLocale)}
                    >
                      WhatsApp
                    </Button>
                  </Group>
                </div>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {filteredProperties.length === 0 && (
        <Text ta="center" py="xl" size="lg" c="dimmed">
          Объекты не найдены. Попробуйте изменить параметры поиска.
        </Text>
      )}
    </Container>
  );
}
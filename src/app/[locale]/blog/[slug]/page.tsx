'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Title, 
  Text, 
  Image, 
  Group, 
  Stack, 
  Badge,
  Button,
  ActionIcon,
  Divider,
  Card,
  Grid
} from '@mantine/core';
import { 
  IconCalendar, 
  IconUser, 
  IconClock, 
  IconShare,
  IconArrowLeft,
  IconEye
} from '@tabler/icons-react';
import { useTranslation } from '@/hooks/useTranslation';
import { blogAPI } from '@/services/api';
import { BlogPost } from '@/types/strapi';
import { Locale } from '@/types/locale';
import { BackToHome } from '@/components/BackToHome';

// Генерация статических параметров для ISR
export async function generateStaticParams() {
  const locales = ['en', 'pl', 'fr', 'ru', 'uk'];
  const blogSlugs = ['why-visit-tenerife-2025', 'best-beaches-tenerife', 'tenerife-weather-guide']; // Основные статьи
  
  return locales.flatMap(locale => 
    blogSlugs.map(slug => ({
      locale: locale as Locale,
      slug
    }))
  );
}

// Настройка revalidate для ISR
export const revalidate = 3600; // Обновление каждый час

interface BlogArticlePageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [articleSlug, setArticleSlug] = useState<string>('');
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    params.then(({ locale, slug }) => {
      setCurrentLocale(locale);
      setArticleSlug(slug);
    });
  }, [params]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleSlug || !currentLocale) return;
      
      try {
        setLoading(true);
        const response = await blogAPI.getBySlug(articleSlug, currentLocale);
        setArticle(response.data);
        
        // Получаем связанные статьи
        const relatedResponse = await blogAPI.getAll(currentLocale);
        const filtered = relatedResponse.data?.filter(post => 
          post.slug !== articleSlug && 
          (post.category?.name === response.data?.category?.name)
        ).slice(0, 3) || [];
        setRelatedPosts(filtered);
        
      } catch (err) {
        setError('Статья не найдена');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    if (mounted && articleSlug && currentLocale) {
      fetchArticle();
    }
  }, [mounted, articleSlug, currentLocale]);

  if (!mounted || loading) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center">Загрузка...</Text>
      </Container>
    );
  }

  if (error || !article) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center" c="red">{error || 'Статья не найдена'}</Text>
        <Group justify="center" mt="md">
          <Button onClick={() => router.push(`/${currentLocale}/blog`)}>
            Вернуться к блогу
          </Button>
        </Group>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLocale === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
        onClick={() => router.push(`/${currentLocale}/blog`)}
        mb="xl"
      >
        Вернуться к блогу
      </Button>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="lg" className="glass-effect">
            {/* Заголовок статьи */}
            <Group justify="space-between" align="flex-start" mb="md">
              <Title order={1} className="gradient-text">
                {article.title}
              </Title>
              <ActionIcon variant="light" onClick={shareUrl}>
                <IconShare size={16} />
              </ActionIcon>
            </Group>

            {/* Мета-информация */}
            <Group gap="md" mb="xl">
              <Group gap="xs">
                <IconUser size={16} />
                <Text size="sm">{article.author}</Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={16} />
                <Text size="sm">{formatDate(article.createdAt)}</Text>
              </Group>
              <Group gap="xs">
                <IconClock size={16} />
                <Text size="sm">{article.reading_time} мин чтения</Text>
              </Group>
              {article.featured && (
                <Badge color="blue" variant="gradient">
                  ⭐ Рекомендуемая
                </Badge>
              )}
            </Group>

            {/* Основное изображение */}
            {article.featured_image && (
              <Image
                src={article.featured_image.url}
                alt={article.title}
                height={400}
                radius="md"
                mb="xl"
              />
            )}

            {/* Описание */}
            {(article.excerpt || article.description) && (
              <Text size="lg" c="dimmed" mb="xl" fw={500}>
                {article.excerpt || article.description}
              </Text>
            )}

            <Divider mb="xl" />

            {/* Контент статьи */}
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{ 
                lineHeight: 1.8,
                fontSize: '16px'
              }}
            />

            {/* Теги */}
            {article.tags && article.tags.length > 0 && (
              <>
                <Divider my="xl" />
                <Group gap="xs">
                  <Text fw={500}>Теги:</Text>
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="light">
                      {tag}
                    </Badge>
                  ))}
                </Group>
              </>
            )}
          </Card>
        </Grid.Col>

        {/* Боковая панель */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            {/* Информация о категории */}
            {article.category && (
              <Card withBorder p="md" className="glass-effect">
                <Text fw={500} mb="xs">Категория</Text>
                <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                  {article.category.name}
                </Badge>
              </Card>
            )}

            {/* Связанные статьи */}
            {relatedPosts.length > 0 && (
              <Card withBorder p="md" className="glass-effect">
                <Text fw={500} mb="md">Похожие статьи</Text>
                <Stack gap="md">
                  {relatedPosts.map((post) => (
                    <Card key={post.id} withBorder radius="md" p="sm">
                      <Group gap="md">
                        {post.featured_image && (
                          <Image
                            src={post.featured_image.url}
                            alt={post.title}
                            w={60}
                            h={60}
                            radius="sm"
                          />
                        )}
                        <Stack gap="xs" flex={1}>
                          <Text size="sm" fw={500} lineClamp={2}>
                            {post.title}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {formatDate(post.createdAt)}
                          </Text>
                          <Button
                            size="xs"
                            variant="light"
                            onClick={() => router.push(`/${currentLocale}/blog/${post.slug}`)}
                          >
                            Читать
                          </Button>
                        </Stack>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Card>
            )}

            {/* Поделиться */}
            <Card withBorder p="md" className="glass-effect">
              <Text fw={500} mb="md">Поделиться статьей</Text>
              <Group>
                <Button
                  variant="light"
                  size="sm"
                  onClick={shareUrl}
                  leftSection={<IconShare size={16} />}
                >
                  Копировать ссылку
                </Button>
              </Group>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Навигация между статьями */}
      <Card withBorder mt="xl" p="md" className="glass-effect">
        <Group justify="center">
          <Button
            variant="light"
            leftSection={<IconEye size={16} />}
            onClick={() => router.push(`/${currentLocale}/blog`)}
          >
            Посмотреть все статьи
          </Button>
        </Group>
      </Card>
    </Container>
  );
}
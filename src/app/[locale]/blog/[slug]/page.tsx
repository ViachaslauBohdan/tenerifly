'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Image, Stack, Group, Badge, Divider, Button } from '@mantine/core';
import { IconCalendar, IconUser, IconClock, IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/types/locale';

interface BlogArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: {
    url: string;
  };
  author: string;
  reading_time: number;
  createdAt: string;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
}

// Мок-данные для статьи
const mockArticle: BlogArticle = {
  id: 1,
  title: 'Почему стоит посетить Тенерифе в 2025 году',
  slug: 'why-visit-tenerife-2025',
  excerpt: 'Тенерифе - это остров вечной весны, где каждый найдет что-то особенное.',
  content: `
    <h2>Остров вечной весны ждет вас</h2>
    
    <p>Тенерифе — самый большой остров Канарских островов, расположенный в Атлантическом океане. Этот удивительный остров предлагает уникальное сочетание природной красоты, богатой культуры и современных удобств, что делает его идеальным местом для отдыха в любое время года.</p>

    <h3>Уникальный климат</h3>
    
    <p>Одна из главных причин популярности Тенерифе — это его климат. Благодаря расположению недалеко от африканского побережья, остров наслаждается субтропическим климатом с теплыми температурами круглый год. Средняя температура колеблется от 18°C зимой до 24°C летом, что делает остров идеальным для посещения в любой сезон.</p>

    <h3>Природные чудеса</h3>
    
    <p>Тенерифе предлагает невероятное разнообразие ландшафтов на относительно небольшой территории:</p>
    
    <ul>
      <li><strong>Национальный парк Тейде</strong> — дом самой высокой горы Испании (3,715 м)</li>
      <li><strong>Черные вулканические пляжи</strong> — уникальное явление, созданное вулканической активностью</li>
      <li><strong>Лавровые леса Анага</strong> — древние леса, внесенные в список ЮНЕСКО</li>
      <li><strong>Драматические скалы Лос-Хигантес</strong> — впечатляющие утесы высотой до 800 метров</li>
    </ul>

    <h3>Активности для всех</h3>
    
    <p>Независимо от ваших интересов, Тенерифе предлагает множество активностей:</p>
    
    <ul>
      <li>Пешие походы по вулканическим тропам</li>
      <li>Наблюдение за китами и дельфинами</li>
      <li>Серфинг и водные виды спорта</li>
      <li>Посещение традиционных канарских деревень</li>
      <li>Дегустация местных вин и кухни</li>
    </ul>

    <h3>Гастрономия</h3>
    
    <p>Канарская кухня представляет собой уникальное сочетание испанских, африканских и латиноамериканских влияний. Обязательно попробуйте:</p>
    
    <ul>
      <li><strong>Папас арругадас</strong> — молодой картофель в соли с соусом мохо</li>
      <li><strong>Гофио</strong> — традиционная мука из жареных зерен</li>
      <li><strong>Свежую рыбу</strong> — особенно тунца и дорадо</li>
      <li><strong>Местные вина</strong> — выращенные на вулканической почве</li>
    </ul>

    <h3>Культура и традиции</h3>
    
    <p>Тенерифе богат культурными традициями, которые отражают его уникальную историю. Карнавал Санта-Круз де Тенерифе считается одним из самых больших и красочных в мире, уступая только Рио-де-Жанейро.</p>

    <h3>Почему именно 2025 год?</h3>
    
    <p>2025 год — отличное время для посещения Тенерифе по нескольким причинам:</p>
    
    <ul>
      <li>Новые экологические инициативы делают остров еще более устойчивым</li>
      <li>Улучшенная туристическая инфраструктура</li>
      <li>Специальные программы для путешественников</li>
      <li>Оптимальные цены после восстановления туристической отрасли</li>
    </ul>

    <h3>Заключение</h3>
    
    <p>Тенерифе — это место, где каждый путешественник найдет что-то особенное. От любителей природы до ценителей культуры, от семей с детьми до искателей приключений — этот удивительный остров предлагает незабываемые впечатления для всех.</p>
    
    <p>Планируете поездку на Тенерифе? Свяжитесь с нами, и мы поможем организовать идеальный отдых на острове вечной весны!</p>
  `,
  featured_image: {
    url: 'https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg'
  },
  author: 'Tenerifly Team',
  reading_time: 8,
  createdAt: '2025-01-20T00:00:00.000Z',
  tags: ['Путешествия', 'Тенерифе', '2025', 'Канарские острова'],
  meta_title: 'Почему стоит посетить Тенерифе в 2025 году | Tenerifly',
  meta_description: 'Откройте для себя все причины посетить Тенерифе в 2025 году. Уникальный климат, природные чудеса, активности и многое другое ждет вас на острове вечной весны.'
};

interface BlogArticlePageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [article, setArticle] = useState<BlogArticle>(mockArticle);

  useEffect(() => {
    setMounted(true);
    params.then(({ locale, slug }) => {
      setCurrentLocale(locale);
      // Здесь можно загрузить статью по slug
      console.log('Loading article:', slug);
    });
  }, [params]);

  if (!mounted) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLocale === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container size="md" py="xl">
      <Button
        variant="light"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.push(`/${currentLocale}/blog`)}
        mb="xl"
      >
        Назад к блогу
      </Button>

      <Stack gap="md">
        {/* Заголовок и мета-информация */}
        <div>
          <Title order={1} mb="md">
            {article.title}
          </Title>
          
          <Group gap="md" mb="md">
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
          </Group>

          {/* Теги */}
          {article.tags && (
            <Group gap="xs" mb="xl">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="light">
                  {tag}
                </Badge>
              ))}
            </Group>
          )}
        </div>

        {/* Главное изображение */}
        {article.featured_image && (
          <Image
            src={article.featured_image.url}
            alt={article.title}
            radius="md"
            mb="xl"
          />
        )}

        <Divider />

        {/* Содержание статьи */}
        <div 
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{
            lineHeight: 1.7,
            fontSize: '16px'
          }}
        />

        <Divider mt="xl" />

        {/* Призыв к действию */}
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <Title order={3} mb="md">
            Готовы исследовать Тенерифе?
          </Title>
          <Text mb="md">
            Свяжитесь с нами для планирования вашего идеального отдыха
          </Text>
          <Button
            size="lg"
            onClick={() => window.open('https://wa.me/34656641433', '_blank')}
          >
            Написать в WhatsApp
          </Button>
        </div>
      </Stack>
    </Container>
  );
}
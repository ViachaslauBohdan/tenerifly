// Универсальный сервис для кэширования изображений во время сборки
// Поддерживает все типы контента: апартаменты, блоги, туры, машины

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";

interface ImageCache {
  [key: string]: {
    url: string;
    formats: {
      thumbnail: string;
      small: string;
      medium: string;
      large: string;
    };
    timestamp: number;
  };
}

// Кэш изображений в памяти (для времени сборки)
const imageCache: ImageCache = {};

// Типы контента
export type ContentType = "properties" | "blogs" | "tours" | "cars";

// Конфигурация для разных типов контента
const contentConfig = {
  properties: {
    apiPath: "/properties",
    imageField: "images",
    maxImages: 3,
  },
  blogs: {
    apiPath: "/blog-posts",
    imageField: "images",
    maxImages: 2,
  },
  tours: {
    apiPath: "/tours",
    imageField: "images",
    maxImages: 3,
  },
  cars: {
    apiPath: "/cars",
    imageField: "images",
    maxImages: 3,
  },
};

// Функция для оптимизации URL изображения
export function getOptimizedImageUrl(
  imageUrl: string,
  format: "thumbnail" | "small" | "medium" | "large" = "large"
): string {
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  const baseUrl = `${API_URL}${imageUrl}`;
  const width =
    format === "thumbnail"
      ? 150
      : format === "small"
        ? 300
        : format === "medium"
          ? 600
          : 1200;

  return `${baseUrl}?format=webp&width=${width}&quality=${format === "thumbnail" ? 60 : 85}`;
}

// Функция для предзагрузки изображения
export async function preloadImage(imageUrl: string): Promise<void> {
  try {
    const response = await fetch(getOptimizedImageUrl(imageUrl, "medium"), {
      // Добавляем таймаут для предотвращения зависания
      signal: AbortSignal.timeout(10000), // 10 секунд таймаут
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Сохраняем в кэш
    const cacheKey = imageUrl;
    imageCache[cacheKey] = {
      url: imageUrl,
      formats: {
        thumbnail: getOptimizedImageUrl(imageUrl, "thumbnail"),
        small: getOptimizedImageUrl(imageUrl, "small"),
        medium: getOptimizedImageUrl(imageUrl, "medium"),
        large: getOptimizedImageUrl(imageUrl, "large"),
      },
      timestamp: Date.now(),
    };

    console.log(`✅ Preloaded image: ${imageUrl}`);
  } catch (error) {
    // Логируем ошибку, но не прерываем процесс
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.warn(`⚠️ Failed to preload image ${imageUrl}: ${errorMessage}`);
  }
}

// Универсальная функция для предзагрузки изображений контента
export async function preloadContentImages(
  content: {
    title?: string;
    name?: string;
    [key: string]: unknown;
  },
  contentType: ContentType
): Promise<void> {
  const config = contentConfig[contentType];
  const images = content[config.imageField] as
    | Array<{ url: string }>
    | undefined;

  if (!images || images.length === 0) {
    return;
  }

  console.log(
    `🖼️ Preloading ${images.length} images for ${contentType}: ${content.title || content.name}`
  );

  // Предзагружаем ограниченное количество изображений
  const imagesToPreload = images.slice(0, config.maxImages);

  const preloadPromises = imagesToPreload.map((image: { url: string }) =>
    preloadImage(image.url)
  );

  await Promise.allSettled(preloadPromises);
}

// Специализированные функции для каждого типа контента
export async function preloadPropertyImages(property: {
  title: string;
  images?: Array<{ url: string }>;
}): Promise<void> {
  await preloadContentImages(property, "properties");
}

export async function preloadBlogImages(blog: {
  title: string;
  images?: Array<{ url: string }>;
}): Promise<void> {
  await preloadContentImages(blog, "blogs");
}

export async function preloadTourImages(tour: {
  title: string;
  images?: Array<{ url: string }>;
}): Promise<void> {
  await preloadContentImages(tour, "tours");
}

export async function preloadCarImages(car: {
  title: string;
  images?: Array<{ url: string }>;
}): Promise<void> {
  await preloadContentImages(car, "cars");
}

// Функция для получения кэшированного URL
export function getCachedImageUrl(
  imageUrl: string,
  format: "thumbnail" | "small" | "medium" | "large" = "large"
): string {
  const cacheKey = imageUrl;
  const cached = imageCache[cacheKey];

  if (cached) {
    return cached.formats[format];
  }

  // Если нет в кэше, возвращаем оптимизированный URL
  return getOptimizedImageUrl(imageUrl, format);
}

// Функция для очистки старых записей кэша (старше 1 часа)
export function cleanupImageCache(): void {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;

  Object.keys(imageCache).forEach((key) => {
    if (imageCache[key].timestamp < oneHourAgo) {
      delete imageCache[key];
    }
  });
}

// Функция для получения статистики кэша
export function getCacheStats() {
  const totalEntries = Object.keys(imageCache).length;
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  const recentEntries = Object.values(imageCache).filter(
    (entry) => entry.timestamp > oneHourAgo
  ).length;

  return {
    totalEntries,
    recentEntries,
    cacheSize: `${totalEntries} images`,
  };
}

// Экспортируем кэш для отладки
export { imageCache, contentConfig };

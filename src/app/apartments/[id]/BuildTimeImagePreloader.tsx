// Компонент для предзагрузки изображений во время сборки
// Этот компонент рендерится только на сервере во время сборки

import { preloadPropertyImages } from "@/services/imageCacheService";

interface BuildTimeImagePreloaderProps {
  property: {
    title: string;
    images?: Array<{ url: string }>;
  };
}

export default async function BuildTimeImagePreloader({
  property,
}: BuildTimeImagePreloaderProps) {
  // Предзагружаем изображения только во время сборки (не критично для сборки)
  if (process.env.NODE_ENV === "production") {
    try {
      await preloadPropertyImages(property);
    } catch (error) {
      // Логируем ошибку, но не прерываем сборку
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.warn(`⚠️ Build-time image preloading failed:`, errorMessage);
    }
  }

  return null; // Не рендерит ничего
}

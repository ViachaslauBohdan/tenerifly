"use client";

import { useEffect } from "react";

interface ImagePreloaderProps {
  images: Array<{ id: number; url: string }>;
  baseUrl?: string;
}

export default function ImagePreloader({ images, baseUrl }: ImagePreloaderProps) {
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = images.slice(1, 3).map((image) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          
          const imageUrl = image.url.startsWith("http") 
            ? image.url 
            : `${baseUrl || process.env.NEXT_PUBLIC_STRAPI_API_URL}${image.url}?format=webp&width=600`;
          
          img.src = imageUrl;
        });
      });

      try {
        await Promise.allSettled(imagePromises);
        console.log("Images preloaded successfully");
      } catch (error) {
        console.warn("Some images failed to preload:", error);
      }
    };

    if (images.length > 1) {
      preloadImages();
    }
  }, [images, baseUrl]);

  return null; // Этот компонент не рендерит ничего видимого
}

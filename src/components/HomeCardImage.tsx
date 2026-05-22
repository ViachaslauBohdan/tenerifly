"use client";

import Image from "next/image";

type HomeCardImageProps = {
  src: string;
  alt: string;
  onClick?: () => void;
  className?: string;
};

export function HomeCardImage({
  src,
  alt,
  onClick,
  className = "",
}: HomeCardImageProps) {
  const resolvedSrc =
    src && src.length > 0 ? src : "/placeholder.svg?height=400&width=600";

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className={`object-cover ${onClick ? "cursor-pointer hover:scale-105 transition-transform duration-300" : ""} ${className}`}
      onClick={onClick}
    />
  );
}

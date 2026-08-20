"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type AtlanticoImageProps = {
  src: string | string[] | null;
  alt: string;
  className?: string;
  onClick?: () => void;
};

export function AtlanticoImage({
  src,
  alt,
  className = "",
  onClick,
}: AtlanticoImageProps) {
  const candidates = useMemo(
    () => (Array.isArray(src) ? src.filter(Boolean) : src ? [src] : []),
    [src]
  );
  const candidateKey = candidates.join("|");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [candidateKey]);

  const current = candidates[index];
  if (!current) return null;

  return (
    <Image
      key={current}
      src={current}
      alt={alt}
      fill
      unoptimized
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className={`object-cover ${onClick ? "cursor-pointer hover:scale-105 transition-transform duration-300" : ""} ${className}`.trim()}
      onClick={onClick}
      onError={() => setIndex((prev) => prev + 1)}
    />
  );
}

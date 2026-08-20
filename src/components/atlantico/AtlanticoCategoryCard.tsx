"use client";

import Link from "next/link";
import { AtlanticoImage } from "./AtlanticoImage";
import { atlanticoImageUrl } from "@/lib/atlantico/images";
import type { AtlanticoClassification } from "@/lib/atlantico/types";

type AtlanticoCategoryCardProps = {
  classification: AtlanticoClassification;
  href: string;
};

export function AtlanticoCategoryCard({
  classification,
  href,
}: AtlanticoCategoryCardProps) {
  const count = classification.count ?? 0;
  const imageSrc = atlanticoImageUrl(classification.image);

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-lg shadow-md ring-1 ring-black/5 transition-shadow hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] bg-slate-800">
        <AtlanticoImage
          src={imageSrc}
          alt={classification.name}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10"
          aria-hidden
        />
        {count > 0 ? (
          <span
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/85 text-sm font-semibold text-white shadow"
            aria-label={String(count)}
          >
            {count}
          </span>
        ) : null}
        <h3 className="absolute inset-x-3 bottom-4 text-center text-lg font-semibold text-white drop-shadow-md md:text-xl">
          {classification.name}
        </h3>
      </div>
    </Link>
  );
}

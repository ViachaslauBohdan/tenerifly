"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const heroSearchCtaBaseClass =
  "flex min-h-[48px] shrink-0 items-center justify-center gap-2 px-5 text-sm font-bold normal-case tracking-normal text-white outline-none transition-colors focus-visible:outline-none sm:min-h-[68px] sm:self-stretch sm:px-8 sm:uppercase sm:tracking-wide md:min-w-[9.5rem]";

export const heroSearchCtaClass = `${heroSearchCtaBaseClass} bg-blue-600 hover:bg-blue-700`;

export const heroSearchCtaOrangeClass = `${heroSearchCtaBaseClass} bg-[#FF9F24] hover:bg-[#f5921a]`;

type HeroSearchCtaButtonProps = {
  label: string;
  onClick: () => void;
};

export function HeroSearchCtaButton({ label, onClick }: HeroSearchCtaButtonProps) {
  return (
    <button type="button" onClick={onClick} className={heroSearchCtaClass}>
      <span>{label}</span>
      <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
    </button>
  );
}

type HeroSearchCtaLinkProps = {
  href: string;
  label: string;
  variant?: "blue" | "orange";
  className?: string;
};

export function HeroSearchCtaLink({
  href,
  label,
  variant = "blue",
  className: classNameProp,
}: HeroSearchCtaLinkProps) {
  const className = [
    variant === "orange" ? heroSearchCtaOrangeClass : heroSearchCtaClass,
    classNameProp,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={className}>
      <span>{label}</span>
      <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
    </Link>
  );
}

"use client";

import Link, { useLinkStatus } from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PendingLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  trailingIcon?: "arrow" | "none";
};

function PendingLinkContent({
  children,
  trailingIcon = "none",
}: {
  children: React.ReactNode;
  trailingIcon?: "arrow" | "none";
}) {
  const { pending } = useLinkStatus();

  return (
    <>
      <span className={cn(pending && "opacity-80")}>{children}</span>
      {pending ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
      ) : trailingIcon === "arrow" ? (
        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
      ) : null}
    </>
  );
}

export function PendingLink({
  href,
  children,
  className,
  trailingIcon = "none",
}: PendingLinkProps) {
  return (
    <Link href={href} prefetch className={className}>
      <PendingLinkContent trailingIcon={trailingIcon}>
        {children}
      </PendingLinkContent>
    </Link>
  );
}

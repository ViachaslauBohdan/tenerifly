"use client";

import { PendingLink } from "@/components/PendingLink";
import { cn } from "@/lib/utils";

type ViewDetailsLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ViewDetailsLink({ href, children, className }: ViewDetailsLinkProps) {
  return (
    <PendingLink
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors",
        className
      )}
    >
      {children}
    </PendingLink>
  );
}

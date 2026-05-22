"use client";

import { PendingLink } from "@/components/PendingLink";
import { cn } from "@/lib/utils";

type ViewAllLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ViewAllLink({ href, children, className }: ViewAllLinkProps) {
  return (
    <PendingLink
      href={href}
      trailingIcon="arrow"
      className={cn(
        "flex shrink-0 items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl ml-8",
        className
      )}
    >
      {children}
    </PendingLink>
  );
}

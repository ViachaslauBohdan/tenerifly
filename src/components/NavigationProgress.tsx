"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function isSameOriginNavigation(href: string, currentPath: string): boolean {
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    const next = `${url.pathname}${url.search}`;
    return next !== currentPath;
  } catch {
    return false;
  }
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const currentPath = `${window.location.pathname}${window.location.search}`;

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
          return;
        }
        if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
        if (isSameOriginNavigation(href, currentPath)) {
          setActive(true);
        }
        return;
      }

      const navControl = target.closest("[data-navigation-href]");
      if (navControl) {
        const href = navControl.getAttribute("data-navigation-href");
        if (href && isSameOriginNavigation(href, currentPath)) {
          setActive(true);
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  if (!active) return null;

  return (
    <div
      className="navigation-progress-bar fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-blue-600"
      role="progressbar"
      aria-hidden
    />
  );
}

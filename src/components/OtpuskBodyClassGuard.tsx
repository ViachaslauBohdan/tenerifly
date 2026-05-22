"use client";

import { useEffect } from "react";

function collectOtpuskBodyClasses(): string[] {
  return [...document.body.classList].filter((cls) =>
    cls.startsWith("new_")
  );
}

function startBodyClassGuard(): () => void {
  let preserved = collectOtpuskBodyClasses();

  const restore = () => {
    for (const cls of preserved) {
      document.body.classList.add(cls);
    }
  };

  const sync = () => {
    const current = collectOtpuskBodyClasses();
    if (current.length > 0) {
      preserved = current;
      return;
    }
    if (preserved.length > 0) {
      restore();
    }
  };

  sync();
  const observer = new MutationObserver(sync);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => observer.disconnect();
}

/**
 * Otpusk onsite JS adds layout classes to document.body. Next.js/React
 * overwrites body.className when it owns the attribute (e.g. font variables).
 * Root layout also injects {@link OTPUSK_BODY_CLASS_GUARD_INLINE} before hydration;
 * this client guard covers late navigations and re-mounts.
 */
export function OtpuskBodyClassGuard() {
  useEffect(() => {
    if (!document.body) {
      return;
    }
    return startBodyClassGuard();
  }, []);

  return null;
}

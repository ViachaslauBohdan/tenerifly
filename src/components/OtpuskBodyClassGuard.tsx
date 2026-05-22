"use client";

import { useEffect } from "react";

function collectOtpuskBodyClasses(): string[] {
  return [...document.body.classList].filter((cls) =>
    cls.startsWith("new_")
  );
}

/**
 * Otpusk onsite JS adds layout classes to document.body. Next.js/React
 * overwrites body.className when it owns the attribute (e.g. font variables).
 * This guard re-applies Otpusk classes after React or other code strips them.
 */
export function OtpuskBodyClassGuard() {
  useEffect(() => {
    let preserved = new Set(collectOtpuskBodyClasses());

    const restore = () => {
      for (const cls of preserved) {
        document.body.classList.add(cls);
      }
    };

    const observer = new MutationObserver(() => {
      const current = collectOtpuskBodyClasses();
      if (current.length > 0) {
        preserved = new Set(current);
        return;
      }

      if (preserved.size > 0) {
        restore();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

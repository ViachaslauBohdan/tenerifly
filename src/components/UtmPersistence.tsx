"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { syncUtmInAddressBar } from "@/lib/utm";

function UtmPersistenceInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams?.toString() ?? "";

  useEffect(() => {
    syncUtmInAddressBar({
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      history: window.history,
      storages: [window.sessionStorage, window.localStorage],
    });
  }, [pathname, searchKey]);

  return null;
}

export function UtmPersistence() {
  return (
    <Suspense fallback={null}>
      <UtmPersistenceInner />
    </Suspense>
  );
}

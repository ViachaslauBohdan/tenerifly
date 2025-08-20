// app/apartments/page.tsx
import { Suspense } from "react";
import ApartmentsClient from "./client";

export default function ApartmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApartmentsClient />
    </Suspense>
  );
}

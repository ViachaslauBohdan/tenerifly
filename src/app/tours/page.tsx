
import { Suspense } from "react";
import ToursClient from "./client";

export default function ToursPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToursClient />
    </Suspense>
  );
}

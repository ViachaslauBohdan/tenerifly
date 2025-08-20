
import { Suspense } from "react";
import CarsClient from "./client";

export default function CarsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarsClient />
    </Suspense>
  );
}

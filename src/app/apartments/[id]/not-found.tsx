"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function NotFound() {
  const { createLocaleLink } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The property you're looking for doesn't exist or has been removed.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href={createLocaleLink("/apartments")}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse All Properties
          </Link>

          <div>
            <Link
              href={createLocaleLink("/")}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

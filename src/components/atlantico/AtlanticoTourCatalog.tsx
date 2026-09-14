"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AtlanticoExcursionCard } from "@/components/AtlanticoExcursionCard";
import { AtlanticoCategoriesHeading } from "./AtlanticoCategoriesHeading";
import { AtlanticoCategoryCard } from "./AtlanticoCategoryCard";
import { AtlanticoExcursionsByChannel } from "./AtlanticoExcursionsByChannel";
import { AtlanticoIframeBooking } from "./AtlanticoIframeBooking";
import { AtlanticoTourCard } from "./AtlanticoTourCard";
import { getAtlanticoUiCopy } from "./atlanticoCopy";
import { CatalogBackLink } from "@/components/CatalogBackLink";
import { useTranslation } from "@/hooks/useTranslation";
import type { AtlanticoClassification } from "@/lib/atlantico/types";
import type { AtlanticoTourSummary } from "@/lib/atlantico/types";
import type { Locale } from "@/types/locale";

type AtlanticoTourCatalogProps = {
  locale: Locale | string;
};

function AtlanticoTourCatalogApi({ locale }: AtlanticoTourCatalogProps) {
  const { createLocaleLink } = useTranslation();
  const searchParams = useSearchParams();
  const copy = getAtlanticoUiCopy(locale);
  const categoryId = searchParams.get("category") || "";

  const [classifications, setClassifications] = useState<
    AtlanticoClassification[]
  >([]);
  const [tours, setTours] = useState<AtlanticoTourSummary[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTours, setLoadingTours] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      setLoadingCategories(true);
      setUnavailable(false);
      try {
        const res = await fetch(
          `/api/atlantico/classifications?locale=${encodeURIComponent(String(locale))}`
        );
        if (res.status === 503) {
          if (!cancelled) setUnavailable(true);
          return;
        }
        const data = (await res.json()) as {
          classifications?: AtlanticoClassification[];
        };
        if (!cancelled) {
          setClassifications(res.ok ? data.classifications ?? [] : []);
        }
      } catch {
        if (!cancelled) setUnavailable(true);
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    }

    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    if (!categoryId) {
      setTours([]);
      setLoadingTours(false);
      return;
    }

    let cancelled = false;

    async function loadTours() {
      setLoadingTours(true);
      try {
        const res = await fetch(
          `/api/atlantico/tours?locale=${encodeURIComponent(String(locale))}&classification=${encodeURIComponent(categoryId)}`
        );
        if (res.status === 503) {
          if (!cancelled) setUnavailable(true);
          return;
        }
        const data = (await res.json()) as { tours?: AtlanticoTourSummary[] };
        if (!cancelled) setTours(res.ok ? data.tours ?? [] : []);
      } catch {
        if (!cancelled) setTours([]);
      } finally {
        if (!cancelled) setLoadingTours(false);
      }
    }

    void loadTours();
    return () => {
      cancelled = true;
    };
  }, [categoryId, locale]);

  const selectedCategory = classifications.find(
    (item) => item.id === categoryId || item.code === categoryId
  );

  const toursHref = (id: string) =>
    `${createLocaleLink("/tours")}?category=${encodeURIComponent(id)}`;

  if (unavailable) {
    return <AtlanticoExcursionCard locale={locale} variant="tours" />;
  }

  if (!categoryId) {
    return (
      <div>
        <AtlanticoCategoriesHeading locale={String(locale)} as="h1" />
        {loadingCategories ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="aspect-[4/3] animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        ) : classifications.length === 0 ? (
          <div className="space-y-8">
            <p className="text-center text-gray-500">{copy.noTours}</p>
            <AtlanticoExcursionCard locale={locale} variant="tours" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {classifications
              .filter((classification) => (classification.count ?? 0) > 0)
              .map((classification) => (
                <AtlanticoCategoryCard
                  key={classification.id || classification.code}
                  classification={classification}
                  href={toursHref(classification.id || classification.code)}
                />
              ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <CatalogBackLink
        href={createLocaleLink("/tours")}
        label={copy.backToCategories}
      />
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
        {selectedCategory?.name || copy.loadingTours}
      </h1>
      {loadingTours ? (
        <p className="py-16 text-center text-gray-500">{copy.loadingTours}</p>
      ) : tours.length === 0 ? (
        <p className="py-16 text-center text-gray-500">{copy.noTours}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <AtlanticoTourCard
              key={tour.code || tour.id}
              tour={tour}
              locale={locale}
              href={createLocaleLink(`/tours/${tour.code || tour.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AtlanticoTourCatalog({ locale }: AtlanticoTourCatalogProps) {
  return (
    <AtlanticoExcursionsByChannel
      locale={locale}
      iframe={
        <div>
          <AtlanticoCategoriesHeading locale={String(locale)} as="h1" />
          <AtlanticoIframeBooking locale={locale} />
        </div>
      }
      api={<AtlanticoTourCatalogApi locale={locale} />}
    />
  );
}

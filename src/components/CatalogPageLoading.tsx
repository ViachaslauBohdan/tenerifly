function CatalogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="space-y-3 p-6">
        <div className="h-5 rounded bg-gray-200 w-3/4" />
        <div className="h-4 rounded bg-gray-200 w-full" />
        <div className="h-4 rounded bg-gray-200 w-2/3" />
        <div className="h-10 rounded-lg bg-gray-200 w-full mt-4" />
      </div>
    </div>
  );
}

export function CatalogPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50" aria-busy="true" aria-label="Loading page">
      <div className="pt-[6.25rem] min-[400px]:pt-[6.5rem] sm:pt-[6.25rem] md:pt-16">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="h-9 w-64 max-w-full rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-5 w-96 max-w-full rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="mb-6 h-24 rounded-xl bg-gray-200 animate-pulse" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CatalogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

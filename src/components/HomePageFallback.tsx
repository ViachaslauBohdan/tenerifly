export function HomePageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="h-16 animate-pulse border-b border-gray-200 bg-white/80" />
      <div className="mx-auto mt-20 max-w-5xl px-4 sm:mt-24">
        <div className="mx-auto mb-6 h-10 max-w-lg animate-pulse rounded-lg bg-gray-200/80" />
        <div className="h-36 animate-pulse rounded-2xl bg-white/90 shadow-sm sm:h-40" />
      </div>
    </div>
  );
}

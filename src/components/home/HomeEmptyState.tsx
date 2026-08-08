import { AlertCircle, WifiOff } from "lucide-react";

type HomeEmptyStateProps = {
  type: "loading" | "error" | "empty";
  serverErrorLabel: string;
  noDataLabel: string;
};

export function HomeEmptyState({
  type,
  serverErrorLabel,
  noDataLabel,
}: HomeEmptyStateProps) {
  if (type === "loading") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg animate-pulse"
          >
            <div className="aspect-video bg-gray-200" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-12" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-lg text-red-600">{serverErrorLabel}</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-12 text-center">
      <div className="flex items-center justify-center mb-4">
        <WifiOff className="w-8 h-8 text-blue-500" />
      </div>
      <p className="text-lg text-blue-600">{noDataLabel}</p>
    </div>
  );
}

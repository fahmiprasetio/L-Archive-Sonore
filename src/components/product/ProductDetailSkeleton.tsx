export default function ProductDetailSkeleton() {
  return (
    <div className="py-6 space-y-6" aria-hidden="true">
      <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-lg p-6">
        <div className="aspect-square w-full animate-pulse rounded bg-gray-200" />

        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-2/5 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 mt-6 space-y-4">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <div className="h-3 w-10 animate-pulse rounded bg-gray-200" />
                <div className="h-8 w-28 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-11 w-32 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-11 flex-1 animate-pulse rounded bg-gray-200" />
              <div className="h-11 w-11 animate-pulse rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

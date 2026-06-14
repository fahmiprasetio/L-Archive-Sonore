interface ProductCardSkeletonProps {
  dark?: boolean;
}

export default function ProductCardSkeleton({ dark = false }: ProductCardSkeletonProps) {
  const block = dark ? 'bg-white/10' : 'bg-gray-200';
  return (
    <div
      className={`flex flex-col rounded-lg border p-4 shadow-sm ${
        dark ? 'border-white/10 bg-black/20 backdrop-blur-md' : 'border-gray-200 bg-white'
      }`}
      aria-hidden="true"
    >
      <div className={`mb-4 aspect-square w-full animate-pulse rounded ${block}`} />
      <div className="flex flex-1 flex-col">
        <div className={`h-3 w-16 animate-pulse rounded ${block}`} />
        <div className={`mt-2 h-4 w-3/4 animate-pulse rounded ${block}`} />
        <div className={`mt-2 h-3 w-full animate-pulse rounded ${block}`} />
        <div className={`mt-1.5 h-3 w-5/6 animate-pulse rounded ${block}`} />
        <div className="mt-4 flex items-center justify-between">
          <div className={`h-4 w-16 animate-pulse rounded ${block}`} />
          <div className={`h-7 w-20 animate-pulse rounded ${block}`} />
        </div>
      </div>
    </div>
  );
}

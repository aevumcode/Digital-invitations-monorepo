export function GuestTableSkeleton() {
  return (
    <div className="flex flex-col border rounded-md p-4">
      {/* Mobile skeleton */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-2 border-b pb-3">
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Desktop skeleton */}
      <div className="hidden md:block">
        <div className="grid grid-cols-5 gap-4 border-b pb-4">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 items-center border-b pb-3">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GuestStatsSkeleton() {
  return (
    <div className="hidden md:flex flex-wrap items-center gap-6 py-2">
      <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

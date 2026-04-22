import { Skeleton } from "@/components/ui/skeleton"

export default function CharityLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="space-y-2 border-b pb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-60" />
      </div>

      {/* Hero Skeleton */}
      <div className="rounded-xl border border-sidebar-border overflow-hidden">
        {/* Cover image area */}
        <Skeleton className="aspect-[16/6] w-full rounded-none" />
        <div className="p-6 grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Stats row skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>

      {/* History skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

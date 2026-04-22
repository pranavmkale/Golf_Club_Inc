import { Skeleton } from "@/components/ui/skeleton"

export default function DrawsLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-start justify-between border-bottom pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>

      {/* Current draw card skeleton */}
      <div className="rounded-xl border border-border/50 p-6 space-y-6 h-64">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <Skeleton className="h-4 w-40" />
             <div className="flex gap-2">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-12 w-12 rounded-lg" />
             </div>
          </div>
          <div className="space-y-2">
             <Skeleton className="h-4 w-32" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>

      {/* Past draws skeleton */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

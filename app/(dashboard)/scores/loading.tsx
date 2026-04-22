import { Skeleton } from "@/components/ui/skeleton"

export default function ScoresLoading() {
  return (
    <div className="space-y-6">
      {/* Draw eligibility banner skeleton */}
      <Skeleton className="h-16 w-full rounded-xl" />

      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Score row skeletons */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-4"
          >
            {/* Date + score */}
            <div className="space-y-1.5 w-20 shrink-0">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-10" />
            </div>
            {/* Bar */}
            <Skeleton className="h-1.5 flex-1 rounded-full" />
            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

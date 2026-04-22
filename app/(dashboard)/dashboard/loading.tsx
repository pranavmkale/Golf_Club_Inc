import { Skeleton } from "@/components/ui/skeleton"

/**
 * DashboardLoading - Skeleton loader for the main authenticated interface.
 * Mirrors the grid-layout of dashboard/page.tsx for smooth transitions.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <header className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Subscription Card Skeleton */}
        <div className="rounded-xl border border-border/50 p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-4 w-full" />
        </div>

        {/* Charity Summary Skeleton */}
        <div className="rounded-xl border border-border/50 p-6 flex gap-4 items-center">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Score History Skeleton (Span 2) */}
        <div className="md:col-span-2 rounded-xl border border-border/50 p-6 space-y-6">
           <div className="flex justify-between items-center">
             <Skeleton className="h-6 w-32" />
             <Skeleton className="h-10 w-24" />
           </div>
           <div className="space-y-3">
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-12 w-full" />
           </div>
        </div>

        {/* Draw Status Skeleton */}
        <div className="rounded-xl border border-border/50 p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-10 w-10 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-12 w-full mt-4" />
        </div>

        {/* Winners/Claims Skeleton */}
        <div className="rounded-xl border border-border/50 p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  )
}

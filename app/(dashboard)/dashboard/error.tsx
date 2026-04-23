"use client"

import { useEffect } from "react"
import { ShieldAlert, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard Segment Error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-rose-500/10 bg-rose-500/5 px-6 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10">
        <ShieldAlert className="h-8 w-8 text-rose-500" />
      </div>

      <h3 className="mb-2 text-xl font-black tracking-tight uppercase">
        Hub data unavailable
      </h3>

      <p className="mb-8 max-w-sm text-sm text-muted-foreground">
        We ran into a problem loading your dashboard metrics. Don't worry, your
        data is safe—our connection is just having a moment.
      </p>

      <Button
        onClick={() => reset()}
        className="h-12 gap-2 px-8 text-xs font-bold tracking-widest uppercase"
      >
        <RefreshCcw className="h-4 w-4" />
        Retry Dashboard
      </Button>
    </div>
  )
}

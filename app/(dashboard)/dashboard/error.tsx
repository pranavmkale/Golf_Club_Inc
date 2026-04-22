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
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-rose-500/10 rounded-3xl bg-rose-500/5">
      <div className="h-16 w-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6">
        <ShieldAlert className="h-8 w-8 text-rose-500" />
      </div>
      
      <h3 className="text-xl font-black uppercase tracking-tight mb-2">
        Hub data unavailable
      </h3>
      
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        We ran into a problem loading your dashboard metrics. Don't worry, your data is safe—our connection is just having a moment.
      </p>

      <Button 
        onClick={() => reset()} 
        className="h-12 px-8 text-xs font-bold uppercase tracking-widest gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        Retry Dashboard
      </Button>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an internal tracking service (console for now)
    console.error("Application Error:", error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="h-20 w-20 rounded-3xl bg-rose-500/10 flex items-center justify-center mb-8 rotate-3">
          <AlertTriangle className="h-10 w-10 text-rose-500" />
        </div>
        
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-12">
          An unexpected error occurred. We've been notified and are working on a fix. Please try again or head back to safety.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button 
            onClick={() => reset()} 
            className="flex-1 h-14 text-sm font-bold uppercase tracking-widest gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/"}
            className="flex-1 h-14 text-sm font-bold uppercase tracking-widest"
          >
            Go Home
          </Button>
        </div>
      </div>
      
      <p className="mt-12 text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] opacity-30">
        Internal Error Digest: {error.digest || "UNTRACKED"}
      </p>
    </div>
  )
}

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
    console.error("Application Error:", error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-8 flex h-20 w-20 rotate-3 items-center justify-center rounded-3xl bg-rose-500/10">
          <AlertTriangle className="h-10 w-10 text-rose-500" />
        </div>

        <h1 className="mb-4 text-3xl font-black tracking-tight uppercase">
          Something went wrong
        </h1>
        <p className="mb-12 text-muted-foreground">
          An unexpected error occurred. We've been notified and are working on a
          fix. Please try again or head back to safety.
        </p>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <Button
            onClick={() => reset()}
            className="h-14 flex-1 gap-2 text-sm font-bold tracking-widest uppercase"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="h-14 flex-1 text-sm font-bold tracking-widest uppercase"
          >
            Go Home
          </Button>
        </div>
      </div>

      <p className="mt-12 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-30">
        Internal Error Digest: {error.digest || "UNTRACKED"}
      </p>
    </div>
  )
}

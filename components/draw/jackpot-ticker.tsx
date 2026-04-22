"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function JackpotTicker() {
  const [data, setData] = React.useState<{ amount: number; hasRollover: boolean } | null>(null)
  const [displayAmount, setDisplayAmount] = React.useState(0)

  // 1. Fetch jackpot data
  React.useEffect(() => {
    fetch("/api/draws/jackpot")
      .then((res) => res.json())
      .then((json) => {
        if (json.amount) setData(json)
      })
      .catch(console.error)
  }, [])

  // 2. Animate counter without libraries
  React.useEffect(() => {
    if (!data?.amount) return

    let start = 0
    const end = data.amount
    const duration = 2000 // 2 seconds
    const increment = end / (duration / 16) // roughly 60fps

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayAmount(end)
        clearInterval(timer)
      } else {
        setDisplayAmount(start)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [data])

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="relative">
        {data?.hasRollover && (
          <Badge
            variant="secondary"
            className="absolute -top-6 left-1/2 -translate-x-1/2 animate-pulse bg-primary/20 text-primary border-primary/30"
          >
            Rolls over!
          </Badge>
        )}
        <h2
          className={cn(
            "text-6xl font-black tracking-tight luma-gradient-text sm:text-8xl",
            "transition-all duration-700 ease-out",
            !data && "opacity-0 scale-95"
          )}
        >
          {formatter.format(displayAmount)}
        </h2>
      </div>
      <p className="max-w-[600px] text-center text-muted-foreground sm:text-lg">
        The current jackpot for this month&apos;s draw. Play more, support charities, and win big!
      </p>

      <style jsx>{`
        @keyframes count-up {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

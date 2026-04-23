"use client"

import { CheckCircle2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Charity } from "@/lib/types/database"
import { cn } from "@/lib/utils"

interface CharityBrowserGridProps {
  charities: Charity[]
  currentCharityId: string | null
  selectedId: string | null
  onSelect: (charityId: string) => void
}

export function CharityBrowserGrid({
  charities,
  currentCharityId,
  selectedId,
  onSelect,
}: CharityBrowserGridProps) {
  if (charities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-sm text-muted-foreground">No charities found</p>
        <p className="text-xs text-muted-foreground/60">
          Try a different search term
        </p>
      </div>
    )
  }

  return (
    <div className="grid max-h-100 gap-2 overflow-y-auto pr-1">
      {charities.map((charity) => {
        const isCurrent = charity.id === currentCharityId
        const isSelected = charity.id === selectedId

        return (
          <button
            key={charity.id}
            onClick={() => !isCurrent && onSelect(charity.id)}
            disabled={isCurrent}
            className={cn(
              "flex flex-row items-center gap-4 rounded-xl border p-3 text-left transition-all",
              isCurrent
                ? "cursor-default border-emerald-500/20 bg-emerald-500/5 opacity-80"
                : isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border/50 bg-card hover:border-primary/30 hover:bg-accent/30"
            )}
          >
            <Avatar className="h-10 w-10 shrink-0 border border-border/10 shadow-sm">
              <AvatarImage src={charity.logo_url || ""} alt={charity.name} />
              <AvatarFallback className="bg-primary/10 font-bold text-primary">
                {charity.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="truncate text-sm font-bold tracking-tight">
                {charity.name}
              </p>
              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                {charity.description}
              </p>
            </div>

            <div className="shrink-0 pl-1">
              {isCurrent ? (
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    Current
                  </span>
                </div>
              ) : (
                <span
                  className={cn(
                    "inline-flex h-7 items-center rounded-4xl border px-3 text-[10px] font-bold tracking-wider uppercase",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 bg-background text-muted-foreground"
                  )}
                >
                  {isSelected ? "Selected" : "Select"}
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

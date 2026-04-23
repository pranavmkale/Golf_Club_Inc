import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/5 px-6 py-12 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-8 w-8 text-primary opacity-60" />
      </div>

      <h3 className="mb-2 text-xl font-black tracking-tight uppercase">
        {title}
      </h3>

      <p className="mb-8 max-w-xs text-sm text-muted-foreground">
        {description}
      </p>

      {action && (
        <Button
          variant="outline"
          className="h-10 px-6 text-xs font-bold tracking-widest uppercase"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

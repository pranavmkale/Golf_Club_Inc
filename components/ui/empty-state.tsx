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

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-border/50 rounded-2xl bg-card/5">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Icon className="h-8 w-8 text-primary opacity-60" />
      </div>
      
      <h3 className="text-xl font-black uppercase tracking-tight mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground max-w-xs mb-8">
        {description}
      </p>

      {action && (
        <Button 
          variant="outline" 
          className="h-10 px-6 text-xs font-bold uppercase tracking-widest"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

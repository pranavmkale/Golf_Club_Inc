"use client"

import React from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SectionBoundaryState {
  hasError: boolean
  error: Error | null
}

interface SectionBoundaryProps {
  children: React.ReactNode
  label?: string // e.g. "Scores", "Draw Status", "Charity"
}

/**
 * SectionBoundary - A localized React class-based error boundary.
 * Wraps non-critical dashboard sections so a single data failure
 * doesn't crash the entire authenticated layout.
 */
export class SectionBoundary extends React.Component<SectionBoundaryProps, SectionBoundaryState> {
  constructor(props: SectionBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): SectionBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[SectionBoundary: ${this.props.label}]`, error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center border border-rose-500/10 rounded-2xl bg-rose-500/5 min-h-[160px]">
          <AlertTriangle className="h-8 w-8 text-rose-500/50 mb-3" />
          <p className="text-sm font-bold uppercase tracking-tight text-rose-500/70 mb-1">
            {this.props.label ? `${this.props.label} unavailable` : "Section unavailable"}
          </p>
          <p className="text-xs text-muted-foreground mb-4 max-w-xs">
            We couldn't load this section. Your data is safe.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest gap-1"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            <RefreshCcw className="h-3 w-3" />
            Retry
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

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
export class SectionBoundary extends React.Component<
  SectionBoundaryProps,
  SectionBoundaryState
> {
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
        <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-rose-500/10 bg-rose-500/5 px-6 py-10 text-center">
          <AlertTriangle className="mb-3 h-8 w-8 text-rose-500/50" />
          <p className="mb-1 text-sm font-bold tracking-tight text-rose-500/70 uppercase">
            {this.props.label
              ? `${this.props.label} unavailable`
              : "Section unavailable"}
          </p>
          <p className="mb-4 max-w-xs text-xs text-muted-foreground">
            We couldn't load this section. Your data is safe.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 px-4 text-[10px] font-bold tracking-widest uppercase"
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

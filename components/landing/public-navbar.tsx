"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Flag } from "lucide-react"

export function PublicNavbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex w-full justify-center px-4">
      <div className="flex w-full max-w-5xl items-center justify-between rounded-full border border-border/40 bg-background/80 px-4 py-2.5 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
            <Flag className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-black uppercase tracking-tight">Golf Draw</span>
        </Link>

        {/* Nav links — desktop only */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#charities" className="text-muted-foreground transition-colors hover:text-foreground">
            Charities
          </a>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden text-xs font-bold sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="h-8 rounded-full px-4 text-xs font-bold">
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { SparklesIcon } from "lucide-react"

export function LandingNavbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex w-full justify-center px-4">
      <div className="flex w-full max-w-5xl items-center justify-between rounded-full border border-border/40 bg-background/80 px-4 py-2.5 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="flex w-1/3 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="rounded-full bg-primary p-1.5">
              <SparklesIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="inline-block font-bold tracking-tight">Luma</span>
          </Link>
        </div>

        <div className="hidden w-1/3 items-center justify-center md:flex">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="#features"
              className="transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#components"
              className="transition-colors hover:text-primary"
            >
              Components
            </Link>
            <Link href="#docs" className="transition-colors hover:text-primary">
              Docs
            </Link>
          </nav>
        </div>

        <div className="flex w-1/3 items-center justify-end gap-3">
          <ModeToggle />
          <Button
            asChild
            className="hidden h-9 rounded-full px-4 text-xs sm:flex"
          >
            <Link
              href="https://github.com/PranavKale03/shadcn-template-luma.git"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-brand-github"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
              </svg>
              Star on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

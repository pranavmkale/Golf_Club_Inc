"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Heart, Calendar } from "lucide-react"
import { format, endOfMonth } from "date-fns"

interface HeroSectionProps {
  activeSubscriberCount: number
  nextDrawDate: string
}

export function HeroSection({ activeSubscriberCount, nextDrawDate }: HeroSectionProps) {
  return (
    <section className="relative min-h-svh flex items-center overflow-hidden">
      {/* Subtle radial background — CSS vars only */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in oklch, var(--primary) 8%, transparent), transparent 70%)",
        }}
      />

      <div className="container mx-auto grid gap-16 px-6 py-28 lg:grid-cols-2 lg:items-center lg:py-0 lg:min-h-svh">
        {/* ── LEFT: Text content ── */}
        <div className="flex flex-col gap-8">
          {/* Eyebrow pill */}
          <div className="hero-animate hero-delay-0 inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
            Golf · Charity · Monthly Draws
          </div>

          {/* H1 — word-by-word stagger */}
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="hero-animate hero-delay-0 inline-block">Play</span>{" "}
            <span className="hero-animate hero-delay-1 inline-block">golf.</span>
            <br />
            <span className="hero-animate hero-delay-2 inline-block luma-gradient-text">Change</span>{" "}
            <span className="hero-animate hero-delay-3 inline-block luma-gradient-text">lives.</span>
          </h1>

          {/* Subheadline */}
          <p className="hero-animate hero-delay-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Enter your Stableford scores each month, compete for prize draws, and automatically
            donate to a charity you believe in.
          </p>

          {/* CTAs */}
          <div className="hero-animate hero-delay-5 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 text-sm font-bold uppercase tracking-wider">
              <Link href="/register">Start for free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-sm font-bold uppercase tracking-wider"
            >
              <a href="#how-it-works">How it works</a>
            </Button>
          </div>

          {/* Trust line */}
          <p className="hero-animate hero-delay-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground/70">
            <span>No hidden fees</span>
            <span aria-hidden className="select-none opacity-40">·</span>
            <span>Cancel anytime</span>
            <span aria-hidden className="select-none opacity-40">·</span>
            <span>Stripe secured</span>
          </p>
        </div>

        {/* ── RIGHT: Floating stat cards ── */}
        <div className="relative hidden lg:flex lg:items-center lg:justify-center">
          <div className="relative h-[420px] w-[380px]">
            {/* Card 1 — Jackpot */}
            <Card className="stat-card stat-card-delay-0 absolute left-0 top-0 w-60 border-border/50 bg-card/80 backdrop-blur-md shadow-xl p-0">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  <Trophy className="h-3.5 w-3.5 text-primary" />
                  Current Jackpot
                </div>
                <div className="text-2xl font-black">
                  Loading…
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground uppercase tracking-widest">Rolls over if unclaimed</div>
              </CardContent>
            </Card>

            {/* Card 2 — Charities */}
            <Card className="stat-card stat-card-delay-1 absolute right-0 top-24 w-56 border-border/50 bg-card/80 backdrop-blur-md shadow-xl p-0">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  <Heart className="h-3.5 w-3.5 text-primary" />
                  Subscribers
                </div>
                <div className="text-2xl font-black">
                  {activeSubscriberCount.toLocaleString()}+
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground uppercase tracking-widest">Active supporters</div>
              </CardContent>
            </Card>

            {/* Card 3 — Next draw */}
            <Card className="stat-card stat-card-delay-2 absolute bottom-0 left-8 w-56 border-border/50 bg-card/80 backdrop-blur-md shadow-xl p-0">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Next Draw
                </div>
                <div className="text-lg font-black">{nextDrawDate}</div>
                <div className="mt-1 text-[10px] text-muted-foreground uppercase tracking-widest">Monthly draw date</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-animate {
          opacity: 0;
          animation: hero-fade-up 0.6s ease forwards;
        }
        .hero-delay-0 { animation-delay: 0ms; }
        .hero-delay-1 { animation-delay: 100ms; }
        .hero-delay-2 { animation-delay: 200ms; }
        .hero-delay-3 { animation-delay: 300ms; }
        .hero-delay-4 { animation-delay: 500ms; }
        .hero-delay-5 { animation-delay: 700ms; }

        @keyframes stat-slide-in {
          from { opacity: 0; transform: translateX(32px) translateY(8px); }
          to   { opacity: 1; transform: translateX(0) translateY(0); }
        }
        .stat-card {
          opacity: 0;
          animation: stat-slide-in 0.7s ease forwards;
        }
        .stat-card-delay-0 { animation-delay: 800ms; }
        .stat-card-delay-1 { animation-delay: 1000ms; }
        .stat-card-delay-2 { animation-delay: 1200ms; }
      `}</style>
    </section>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JackpotTicker } from "@/components/draw/jackpot-ticker"
import { ArrowRight, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div 
          className="absolute inset-0 opacity-20 animate-bg-shift"
          style={{
            background: 'radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 50%), radial-gradient(circle at 0% 0%, var(--secondary) 0%, transparent 40%), radial-gradient(circle at 100% 100%, var(--accent) 0%, transparent 40%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="container relative mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 animate-fade-in">
          <Heart className="h-4 w-4" />
          <span>Transforming lives through every game</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl flex flex-col gap-2 animate-slide-up">
          <span>Play for Purpose.</span>
          <span className="luma-gradient-text uppercase">Win for Good.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl animate-slide-up animation-delay-200">
          Join a global community driving charitable impact through friendly competition. 
          Submit your scores, support world-class causes, and win life-changing prizes.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up animation-delay-300">
          <Link href="/register">
            <Button size="lg" className="h-14 px-8 text-lg font-bold gap-2 shadow-2xl shadow-primary/20">
              Start Playing
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/charities">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold bg-background/50 backdrop-blur-md">
              See Our Charities
            </Button>
          </Link>
        </div>

        <div className="mt-20 animate-fade-in animation-delay-500">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Current Monthly Prize Pool</p>
          <JackpotTicker />
        </div>
      </div>

      <style jsx>{`
        @keyframes bg-shift {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(2%, 2%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .animate-bg-shift {
          animation: bg-shift 20s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animation-delay-200 { animation-delay: 0.2s; opacity: 0; }
        .animation-delay-300 { animation-delay: 0.3s; opacity: 0; }
        .animation-delay-500 { animation-delay: 0.5s; opacity: 0; }
      `}</style>
    </section>
  )
}

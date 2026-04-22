"use client"

import { Trophy, Star, Target } from "lucide-react"

const tiers = [
  {
    title: "Jackpot",
    match: "5 Matches",
    pool: "40%",
    icon: Star,
    highlight: true,
    description: "The ultimate prize. Match all 5 numbers correctly to claim the lion's share of the pool.",
  },
  {
    title: "Tier 2",
    match: "4 Matches",
    pool: "35%",
    icon: Trophy,
    highlight: false,
    description: "Incredible reward for precision. Split among everyone who matches 4 out of 5.",
  },
  {
    title: "Tier 3",
    match: "3 Matches",
    pool: "25%",
    icon: Target,
    highlight: false,
    description: "Accessible wins. High probability of winning while supporting your cause.",
  },
]

export function PrizeTiersSection() {
  return (
    <section className="py-24 bg-card/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">Prize Distributions</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Every draw allocates 100% of the prize pool across three tiers.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-center">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className={cn(
                "relative flex flex-col rounded-3xl p-8 transition-all duration-500",
                tier.highlight 
                  ? "bg-background border-2 border-primary shadow-2xl shadow-primary/20 scale-105 z-10 py-12" 
                  : "bg-background/50 border border-border/50 hover:bg-background hover:scale-[1.02]"
              )}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white ring-4 ring-background">
                  Most Anticipated
                </div>
              )}
              
              <div className={cn(
                "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl",
                tier.highlight ? "bg-primary text-white" : "bg-primary/10 text-primary"
              )}>
                <tier.icon className="h-7 w-7" />
              </div>

              <h3 className="text-2xl font-black uppercase tracking-tight mb-1">{tier.title}</h3>
              <p className="text-sm font-bold text-primary mb-6">{tier.match}</p>
              
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-6xl font-black">{tier.pool}</span>
                <span className="text-sm font-bold text-muted-foreground uppercase">Pool Share</span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {tier.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}

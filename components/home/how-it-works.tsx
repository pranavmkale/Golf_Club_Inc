"use client"

import { CreditCard, Trophy, Heart } from "lucide-react"

const steps = [
  {
    icon: CreditCard,
    title: "Subscribe & Support",
    description: "Choose your monthly plan. A significant portion of your subscription goes directly to your selected charity.",
  },
  {
    icon: Trophy,
    title: "Enter Your Scores",
    description: "Submit 5 scores from your regular games. These numbers become your draw entries for the month.",
  },
  {
    icon: Heart,
    title: "Win & Drive Impact",
    description: "Matches are drawn monthly. Win life-changing prizes while knowing you've supported a great cause.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-card/10 border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Three simple steps to combine your passion for play with the power of giving.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className="group relative rounded-2xl border border-border/50 bg-background/50 p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5 animate-slide-up"
              style={{ animationDelay: `${i * 0.2}s`, opacity: 0 }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="absolute top-8 right-8 text-6xl font-black text-primary/5 select-none">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  )
}

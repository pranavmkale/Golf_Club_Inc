import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CreditCard, ClipboardList, Trophy } from "lucide-react"

const steps = [
  {
    number: "1",
    icon: CreditCard,
    title: "Subscribe monthly or yearly",
    body: "Choose your plan. A portion of every subscription goes directly to your chosen charity — automatically.",
  },
  {
    number: "2",
    icon: ClipboardList,
    title: "Log your last 5 Stableford scores",
    body: "After every round, enter your score. Your latest 5 scores become your draw entry numbers for that month.",
  },
  {
    number: "3",
    icon: Trophy,
    title: "Win prizes. Support charity.",
    body: "Match 3, 4 or all 5 numbers in the monthly draw to win. Every month, whether you win or not, your charity does.",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 border-y border-border/40 bg-muted/20 lg:px-24"
    >
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Here&apos;s how it works
          </h2>
          <p className="mt-3 text-muted-foreground">Three simple steps. Real impact.</p>
        </div>

        {/* Steps grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="p-0 group relative overflow-hidden border-border/50 bg-card/40 transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Faint background numeral */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-2 select-none text-[7rem] font-black leading-none text-foreground"
                style={{ opacity: 0.04 }}
              >
                {step.number}
              </span>

              {/* Top accent border */}
              <div className="h-0.5 w-full bg-border" />

              <CardHeader className="pt-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold leading-snug">{step.title}</h3>
              </CardHeader>

              <CardContent className="pb-8">
                <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

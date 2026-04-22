import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import { endOfMonth, format } from "date-fns"

export function FinalCTASection() {
  const drawCloseDate = endOfMonth(new Date())

  return (
    <section className="relative overflow-hidden py-24 bg-primary text-primary-foreground">
      {/* Decorative BG elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_20%_20%,white,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-black uppercase tracking-tighter mb-8">
          <Zap className="h-4 w-4 fill-current" />
          <span>Next draw closes {format(drawCloseDate, "MMMM do")}</span>
        </div>

        <h2 className="mx-auto max-w-4xl text-4xl font-black uppercase tracking-tight sm:text-6xl mb-8">
          Don't Let This Impact <br className="hidden sm:block" /> Slip Through Your Fingers.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80 mb-12">
          Join thousands of players who have already committed to supporting our {format(new Date(), "MMMM")} charities. Your scores could change lives—including your own.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg" variant="secondary" className="h-16 px-10 text-xl font-black gap-3 shadow-2xl">
              SECURE YOUR ENTRY
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm font-medium opacity-60">
          Subscribe in less than 2 minutes. Non-binding. Cancel anytime.
        </p>
      </div>
    </section>
  )
}

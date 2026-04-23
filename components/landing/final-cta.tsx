import Link from "next/link"
import { format, endOfMonth } from "date-fns"
import { Button } from "@/components/ui/button"

export function FinalCta() {
  const drawCloseDate = format(endOfMonth(new Date()), "do MMMM yyyy")

  return (
    <section className="py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Urgency line */}
          <p className="mb-5 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Next draw closes{" "}
            <span className="text-primary">{drawCloseDate}</span>
          </p>

          {/* Heading */}
          <h2 className="text-4xl leading-tight font-black tracking-tight sm:text-5xl lg:text-6xl">
            Ready to play for a cause?
          </h2>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            Join subscribers who are winning prizes and changing lives through
            the sport they love.
          </p>

          {/* Primary CTA */}
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="h-14 px-12 text-base font-bold tracking-wider uppercase shadow-lg shadow-primary/20"
            >
              <Link href="/register">Get started today</Link>
            </Button>
          </div>

          {/* Sign in link */}
          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

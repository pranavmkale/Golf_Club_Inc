import { Suspense } from "react"
import { format, endOfMonth } from "date-fns"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"

import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { CharitySpotlight } from "@/components/landing/charity-spotlight"
import { PrizeTiers } from "@/components/landing/prize-tiers"
import { TrustBar } from "@/components/landing/trust-bar"
import { FinalCta } from "@/components/landing/final-cta"

import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata(
  "Golf · Charity · Monthly Draws",
  "Subscribe, enter your Stableford scores, win monthly prize draws, and automatically support the charity you care about."
)

export default async function PublicPage() {
  const supabase = await createClient()

  // Count active subscribers (head-only query — no rows transferred)
  const { count: activeSubscriberCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("subscription_status", "active")

  // Compute next draw date server-side
  const nextDrawDate = format(endOfMonth(new Date()), "do MMMM yyyy")

  return (
    <main>
      {/* 1. Hero */}
      <HeroSection
        activeSubscriberCount={activeSubscriberCount ?? 0}
        nextDrawDate={nextDrawDate}
      />

      {/* 2. How It Works */}
      <HowItWorks />

      {/* 3. Charity Spotlight — async data, isolated Suspense boundary */}
      <Suspense
        fallback={
          <div className="container mx-auto px-6 py-24">
            <div className="h-64 animate-pulse rounded-3xl bg-muted" />
          </div>
        }
      >
        <CharitySpotlight />
      </Suspense>

      {/* 4. Prize Tiers */}
      <PrizeTiers />

      {/* 5. Trust Bar */}
      <TrustBar />

      {/* 6. Final CTA */}
      <FinalCta />
    </main>
  )
}

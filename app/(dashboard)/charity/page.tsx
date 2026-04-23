import { redirect } from "next/navigation"
import { Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SelectedCharityHero } from "@/components/charity/selected-charity-hero"
import { ContributionStatsCard } from "@/components/charity/contribution-stats-card"
import { ContributionHistoryList } from "@/components/charity/contribution-history-list"
import { SelectCharityClient } from "@/components/charity/select-charity-client"
import type { Charity, Profile } from "@/lib/types/database"
import { PageHeader } from "@/components/layout/page-header"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata(
  "Your Charity",
  "Select your charity and manage your contribution percentage. See your impact over time."
)

export default async function CharityPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch all required data in parallel
  const [
    { data: profileData },
    { data: allCharitiesData },
    { data: contributionsData },
    { data: lifetimeData },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, charity:charities(*)")
      .eq("id", user.id)
      .single(),
    supabase
      .from("charities")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true }),
    supabase
      .from("charity_contributions")
      .select("*, charity:charities(name, logo_url)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("charity_contributions")
      .select("amount")
      .eq("user_id", user.id),
  ])

  const profile = profileData as (Profile & { charity: Charity | null }) | null
  const allCharities = (allCharitiesData as Charity[]) ?? []
  const contributions = (contributionsData as any[]) ?? []
  const totalContributed = (lifetimeData ?? []).reduce(
    (acc, curr) => acc + curr.amount,
    0
  )

  // Subscription logic for calculation
  const subscriptionPrice =
    profile?.subscription_plan === "yearly" ? 99.99 / 12 : 9.99
  const monthlyImpact =
    subscriptionPrice * ((profile?.charity_percentage || 10) / 100)

  // 1. If NO charity selected, show persistent prompt
  if (!profile?.charity) {
    return (
      <div className="flex min-h-[60vh] animate-in flex-col items-center justify-center space-y-6 text-center duration-500 fade-in zoom-in">
        <div className="rounded-full bg-primary/10 p-8">
          <Heart className="h-12 w-12 fill-primary/20 text-primary" />
        </div>
        <div className="max-w-sm space-y-2">
          <h1 className="text-2xl font-black tracking-tight">
            Choose your charity
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Select a charity to receive a portion of your subscription each
            month. You can change it at any time.
          </p>
        </div>

        <SelectCharityClient charities={allCharities} />
      </div>
    )
  }

  return (
    <div className="animate-in space-y-8 pb-12 duration-700 fade-in">
      <PageHeader
        title="My Charity"
        description={
          profile.charity.name
            ? `Supporting ${profile.charity.name} this month.`
            : "No charity selected yet."
        }
      />

      {/* Hero Section */}
      <SelectedCharityHero
        charity={profile.charity}
        charityPercentage={profile.charity_percentage}
        monthlyContribution={monthlyImpact}
        subscriptionAmount={subscriptionPrice}
        allCharities={allCharities}
      />

      {/* Stats Row */}
      <ContributionStatsCard
        totalContributed={totalContributed}
        charityPercentage={profile.charity_percentage}
        charityName={profile.charity.name}
      />

      {/* History Section */}
      <ContributionHistoryList contributions={contributions} />
    </div>
  )
}

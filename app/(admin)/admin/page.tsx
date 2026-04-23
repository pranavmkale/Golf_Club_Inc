import { supabaseAdmin } from "@/lib/supabase/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wallet, Heart, Dices, TrendingUp, Calendar, Trophy } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"

export default async function AdminOverviewPage() {
  // Fetch all analytics data
  const [
    activeSubsRes,
    totalUsersRes,
    prizePoolRes,
    charityTotalRes,
    latestEntriesRes,
    drawsRes,
    usersRes,
    contributionsRes,
    winnersRes,
  ] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("subscription_status", "active"),
    supabaseAdmin
      .from("profiles")
      .select("created_at, subscription_status")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("draws")
      .select("jackpot_amount, tier_4_amount, tier_3_amount")
      .eq("status", "published")
      .order("draw_month", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseAdmin.from("charity_contributions").select("amount, created_at"),
    supabaseAdmin
      .from("draw_entries")
      .select("*", { count: "exact", head: true })
      .order("created_at", { ascending: false })
      .limit(1),
    supabaseAdmin
      .from("draws")
      .select("id, draw_month, jackpot_amount, tier_4_amount, tier_3_amount, total_subscribers, status")
      .order("draw_month", { ascending: false })
      .limit(10),
    supabaseAdmin
      .from("profiles")
      .select("created_at, subscription_status, subscription_plan")
      .order("created_at", { ascending: true }),
    supabaseAdmin
      .from("charity_contributions")
      .select("amount, created_at")
      .order("created_at", { ascending: true }),
    supabaseAdmin
      .from("winners")
      .select("prize_amount, tier, created_at")
      .order("created_at", { ascending: true }),
  ])

  // Get last draw entry count
  const { data: lastDrawData } = await supabaseAdmin
    .from("draws")
    .select("id")
    .order("created_at", { ascending: false })
    .maybeSingle()

  const lastDraw = lastDrawData as { id: string } | null

  let entryCount = 0
  if (lastDraw) {
    const { count } = await supabaseAdmin
      .from("draw_entries")
      .select("*", { count: "exact", head: true })
      .eq("draw_id", lastDraw.id)
    entryCount = count || 0
  }

  const users = (usersRes.data || []) as Array<{ created_at: string; subscription_status: string; subscription_plan?: string }>
  const draws = (drawsRes.data || []) as Array<{
    id: string
    draw_month: string
    jackpot_amount: number
    tier_4_amount: number
    tier_3_amount: number
    total_subscribers: number
    status: string
  }>
  const contributions = (contributionsRes.data || []) as Array<{ amount: number; created_at: string }>
  const winners = (winnersRes.data || []) as Array<{ prize_amount: number; tier: string; created_at: string }>

  const activeSubscribers = activeSubsRes.count || 0
  const totalUsers = users.length

  const prizePool = prizePoolRes.data as { jackpot_amount: number; tier_4_amount: number; tier_3_amount: number } | null
  const latestPool = prizePool
    ? Number(prizePool.jackpot_amount) + Number(prizePool.tier_4_amount) + Number(prizePool.tier_3_amount)
    : 0

  const totalCharity = contributions.reduce((sum, c) => sum + Number(c.amount || 0), 0)
  const totalPrizeMoney = winners.reduce((sum, w) => sum + Number(w.prize_amount || 0), 0)

  const stats = [
    {
      label: "Active Subscribers",
      value: activeSubscribers.toString(),
      icon: Users,
      description: "Users with active billing",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Latest Prize Pool",
      value: `£${latestPool.toLocaleString()}`,
      icon: Wallet,
      description: "Total in last published draw",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Total Charity",
      value: `£${totalCharity.toLocaleString()}`,
      icon: Heart,
      description: "All-time donations raised",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
    {
      label: "Current Entries",
      value: entryCount.toString(),
      icon: Dices,
      description: "Participants in latest draw",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Admin Overview"
          description="Platform metrics, analytics, and performance insights."
        />
        <Link href="/admin/reports">
          <Button variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            View Detailed Reports
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Dashboard */}
      <AnalyticsDashboard
        users={users}
        draws={draws}
        contributions={contributions}
        winners={winners}
      />

      {/* Recent Activity Summary */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Platform Summary</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Total users: {totalUsers} | Total prizes awarded: £{totalPrizeMoney.toLocaleString()} | Total draws: {draws.length}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/draws">
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Manage Draws
                </Button>
              </Link>
              <Link href="/admin/winners">
                <Button variant="outline" size="sm" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Winners
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}

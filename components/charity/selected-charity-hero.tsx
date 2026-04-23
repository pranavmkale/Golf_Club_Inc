"use client"

import * as React from "react"
import Image from "next/image"
import { ExternalLink, RefreshCw, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import type { Charity } from "@/lib/types/database"
import { CharityBrowserDialog } from "./charity-browser-dialog"
import { CharityPercentageSlider } from "./charity-percentage-slider"
import Link from "next/link"

interface SelectedCharityHeroProps {
  charity: Charity
  charityPercentage: number
  monthlyContribution: number
  subscriptionAmount: number
  allCharities: Charity[]
}

export function SelectedCharityHero({
  charity,
  charityPercentage,
  monthlyContribution,
  subscriptionAmount,
  allCharities,
}: SelectedCharityHeroProps) {
  const [browserOpen, setBrowserOpen] = React.useState(false)
  const [sliderOpen, setSliderOpen] = React.useState(false)

  return (
    <>
      <Card className="overflow-hidden border-sidebar-border bg-sidebar p-0 shadow-none">
        <div className="relative aspect-8/2 w-full overflow-hidden">
          {charity.cover_image_url ? (
            <Image
              src={charity.cover_image_url}
              alt={charity.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-primary/20 via-primary/5 to-background" />
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Overlay Content */}
          <div className="absolute right-0 bottom-0 left-0 flex items-end gap-4 p-6">
            <Avatar className="h-16 w-16 border-2 border-white bg-background shadow-xl">
              <AvatarImage src={charity.logo_url || ""} alt={charity.name} />
              <AvatarFallback className="text-xl font-black text-primary">
                {charity.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="mb-1 space-y-0.5">
              <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
                {charity.name}
              </h2>
              <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/80 uppercase drop-shadow-sm">
                <span>Active Support</span>
                <span>•</span>
                <span>Since {new Date(charity.created_at).getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="grid gap-8 p-6 md:grid-cols-5">
          {/* Left Column: Description */}
          <div className="space-y-6 md:col-span-3">
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">About this charity</p>
              <p className="text-sm">{charity.description}</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {charity.website_url && (
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="h-9 gap-2"
                >
                  <Link href={charity.website_url || "#"} target="_blank">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Visit website
                  </Link>
                </Button>
              )}
              {allCharities.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2"
                  onClick={() => setBrowserOpen(true)}
                >
                  <Layers className="h-3.5 w-3.5" />
                  See all charities
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Contribution Details */}
          <div className="md:col-span-2">
            <div className="space-y-6 rounded-2xl border border-sidebar-border/50 bg-secondary/50 p-6 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                    Your contribution rate
                  </p>
                  <p className="text-3xl font-black tabular-nums">
                    {charityPercentage}%
                  </p>
                </div>
                <Button
                  variant="link"
                  className="h-auto p-0 font-bold text-primary hover:no-underline"
                  onClick={() => setSliderOpen(true)}
                >
                  Adjust
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-sidebar-border/30 py-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Monthly impact
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    £{monthlyContribution.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-sidebar-border/30 py-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Minimum required
                  </span>
                  <span className="text-sm font-bold tabular-nums">10%</span>
                </div>
              </div>

              <p className="rounded-lg bg-sidebar-accent/50 p-2 text-[10px] leading-relaxed text-muted-foreground italic">
                Your contribution is processed automatically with each
                subscription renewal.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Row */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-sidebar-border/50 bg-sidebar-accent/30 p-4 px-6 sm:flex-row">
          <p className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
            Not feeling this charity? You can switch anytime.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-2 font-bold text-primary hover:bg-primary/5 hover:text-primary"
            onClick={() => setBrowserOpen(true)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Change charity
          </Button>
        </div>
      </Card>

      <CharityBrowserDialog
        charities={allCharities}
        currentCharityId={charity.id}
        open={browserOpen}
        onOpenChange={setBrowserOpen}
        onSuccess={() => {}} // Revalidation is handled by server action
      />

      <CharityPercentageSlider
        currentPercentage={charityPercentage}
        subscriptionAmount={subscriptionAmount}
        open={sliderOpen}
        onOpenChange={setSliderOpen}
        onSuccess={() => {}} // Revalidation is handled by server action
      />
    </>
  )
}

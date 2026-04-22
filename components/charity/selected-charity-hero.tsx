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
      <Card className="overflow-hidden border-sidebar-border bg-sidebar shadow-none p-0">
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
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-xl bg-background">
              <AvatarImage src={charity.logo_url || ""} alt={charity.name} />
              <AvatarFallback className="text-xl font-black text-primary">
                {charity.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="mb-1 space-y-0.5">
              <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                {charity.name}
              </h2>
              <div className="flex items-center gap-2 text-white/80 text-xs font-medium uppercase tracking-widest drop-shadow-sm">
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
          <div className="md:col-span-3 space-y-6">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-foreground font-medium">About this charity</p>
              <p className="text-sm">{charity.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              {
                charity.website_url && (
                  <Button asChild variant="secondary" size="sm" className="h-9 gap-2">
                    <Link href={charity.website_url || "#"} target="_blank">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Visit website
                    </Link>
                  </Button>
                )
              }
              {
                allCharities.length > 0 && (
                  <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => setBrowserOpen(true)}>
                    <Layers className="h-3.5 w-3.5" />
                    See all charities
                  </Button>
                )
              }
            </div>
          </div>

          {/* Right Column: Contribution Details */}
          <div className="md:col-span-2">
            <div className="rounded-2xl bg-secondary/50 border border-sidebar-border/50 p-6 space-y-6 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                    Your contribution rate
                  </p>
                  <p className="text-3xl font-black tabular-nums">{charityPercentage}%</p>
                </div>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-primary font-bold hover:no-underline"
                  onClick={() => setSliderOpen(true)}
                >
                  Adjust
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-sidebar-border/30">
                  <span className="text-xs font-medium text-muted-foreground">Monthly impact</span>
                  <span className="text-sm font-bold tabular-nums">£{monthlyContribution.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-sidebar-border/30">
                  <span className="text-xs font-medium text-muted-foreground">Minimum required</span>
                  <span className="text-sm font-bold tabular-nums">10%</span>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground leading-relaxed bg-sidebar-accent/50 p-2 rounded-lg italic">
                Your contribution is processed automatically with each subscription renewal.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-sidebar-border/50 bg-sidebar-accent/30 p-4 px-6">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
            Not feeling this charity? You can switch anytime.
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 gap-2 font-bold text-primary hover:text-primary hover:bg-primary/5"
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

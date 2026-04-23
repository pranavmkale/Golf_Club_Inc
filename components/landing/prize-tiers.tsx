import { Card, CardContent } from "@/components/ui/card"

interface TierCardProps {
  label: string
  matchLabel: string
  poolShare: string
  description: string
  isHero?: boolean
  note?: string
}

function TierCard({
  label,
  matchLabel,
  poolShare,
  description,
  isHero,
  note,
}: TierCardProps) {
  return (
    <Card
      className={[
        "relative flex flex-col border-border/50 p-0 transition-all duration-200",
        isHero
          ? "border-primary/40 bg-card shadow-lg shadow-primary/10 lg:z-10 lg:scale-105"
          : "bg-card/40 hover:-translate-y-1",
      ].join(" ")}
    >
      {isHero && <div className="h-0.5 w-full rounded-t-xl bg-primary" />}

      <CardContent className="flex flex-col gap-4 p-7">
        {/* Label */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-black tracking-[0.2em] text-muted-foreground uppercase">
            {label}
          </span>
          {isHero && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase">
              Top Prize
            </span>
          )}
        </div>

        {/* Pool share — big number */}
        <div className="text-4xl font-black tracking-tight sm:text-5xl">
          {poolShare}
        </div>

        {/* Match label */}
        <p className="text-sm font-semibold text-muted-foreground">
          {matchLabel}
        </p>

        {/* Divider */}
        <div className="h-px w-full bg-border/40" />

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {note && (
          <p className="text-xs text-muted-foreground/70 italic">{note}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function PrizeTiers() {
  return (
    <section className="bg-muted/10 py-24 lg:px-24">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black tracking-tight uppercase sm:text-4xl">
            What you could win
          </h2>
          <p className="mt-3 text-muted-foreground">
            Monthly draws. Three ways to win.
          </p>
        </div>

        {/* Cards — hero in center on desktop */}
        <div className="grid items-start gap-6 md:grid-cols-3">
          <TierCard
            label="3-Match Prize"
            matchLabel="3 numbers matched"
            poolShare="25%"
            description="Match any 3 of your 5 draw entries to claim your share of this tier's pot."
          />
          <TierCard
            label="Jackpot"
            matchLabel="5 numbers matched"
            poolShare="40%"
            description="The biggest prize on the board. Match all five draw numbers for your share of the top pot."
            isHero
            note="Rolls over if unclaimed."
          />
          <TierCard
            label="4-Match Prize"
            matchLabel="4 numbers matched"
            poolShare="35%"
            description="Match four of your five draw entries for a substantial slice of this month's pool."
          />
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-muted-foreground/70">
          Prize pool grows with every active subscriber. Prizes split equally
          among winners in the same tier.
        </p>
      </div>
    </section>
  )
}

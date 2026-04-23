import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export async function CharitySpotlight() {
  const supabase = await createClient()

  const { data: charity } = await supabase
    .from("charities")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle()

  if (!charity) return null

  return (
    <section className="py-24 lg:px-24">
      <div className="container mx-auto px-6">
        {/* Section label */}
        <div className="mb-12 flex items-center gap-2 justify-center">
          <span className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <Heart className="h-3.5 w-3.5 text-primary" />
            Featured charity partner
          </span>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image */}
          <div className="relative aspect-2/1 w-full overflow-hidden rounded-3xl">
            {charity.cover_image_url ? (
              <Image
                src={charity.cover_image_url as string}
                alt={`${charity.name} cover photo`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div
                className="h-full w-full rounded-3xl"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklch, var(--primary) 20%, var(--muted)), color-mix(in oklch, var(--primary) 5%, var(--background)))",
                }}
              />
            )}
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {charity.name}
            </h2>

            <p className="line-clamp-3 text-base leading-relaxed text-muted-foreground">
              {charity.description}
            </p>

            <div className="rounded-2xl border border-border/40 bg-muted/30 p-5">
              <p className="text-sm text-muted-foreground">
                Your subscription automatically contributes a minimum of{" "}
                <strong className="text-foreground">10%</strong> to this cause — every single month,
                guaranteed.
              </p>
            </div>

            <div>
              <Button asChild variant="outline" className="h-11 px-7 text-sm font-bold uppercase tracking-wider">
                <Link href="/charity">See all our charities</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

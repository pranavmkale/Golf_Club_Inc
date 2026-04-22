import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart } from "lucide-react"

interface CharitySpotlightProps {
  charity: any
}

export function CharitySpotlightSection({ charity }: { charity: charitySpotlightProps["charity"] }) {
  if (!charity) return null

  return (
    <section className="relative overflow-hidden py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Charity Imagery */}
          <div className="relative w-full aspect-video lg:aspect-square lg:max-w-xl rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={charity.cover_image_url || "/placeholder.jpg"}
              alt={charity.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-2">
              <div className="h-10 w-10 overflow-hidden rounded-lg bg-white p-1">
                <Image
                  src={charity.logo_url || "/placeholder-logo.png"}
                  alt={charity.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-white uppercase tracking-tight">{charity.name}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-bold text-primary uppercase">
              <Heart className="h-4 w-4" />
              <span>This Month's Featured Cause</span>
            </div>
            
            <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
              {charity.name}
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {charity.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 py-4 justify-center lg:justify-start">
              <Link href="/charity">
                <Button size="lg" className="h-14 px-8 font-bold gap-2">
                  Support this Cause
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/charities" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-4">
                View all charities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

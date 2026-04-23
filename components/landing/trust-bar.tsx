import { CircleDollarSign, HeartHandshake, RotateCcw, ShieldCheck } from "lucide-react"

const items = [
  { icon: ShieldCheck, label: "Stripe-secured payments" },
  { icon: CircleDollarSign, label: "Transparent monthly draws" },
  { icon: HeartHandshake, label: "Charity impact guaranteed" },
  { icon: RotateCcw, label: "Cancel anytime" },
]

export function TrustBar() {
  return (
    <div className="border-y border-border/40 bg-muted/10 py-5">
      <div className="container mx-auto px-6">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-0">
          {items.map((item, i) => (
            <li
              key={item.label}
              className={[
                "flex items-center justify-center gap-2.5 py-2 text-sm font-medium text-muted-foreground",
                i < items.length - 1 ? "md:border-r md:border-border/30" : "",
              ].join(" ")}
            >
              <item.icon aria-hidden className="h-4 w-4 text-primary/90" />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

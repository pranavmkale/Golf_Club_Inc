import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/layout/page-header"

interface DrawPageHeaderProps {
  nextDrawDate: string
  daysUntilDraw: number
}

export function DrawPageHeader({
  nextDrawDate,
  daysUntilDraw,
}: DrawPageHeaderProps) {
  const isUrgent = daysUntilDraw <= 3

  return (
    <PageHeader
      title="Monthly Draws"
      description="Your entry updates automatically as you add scores."
    >
      <Badge
        variant={isUrgent ? "destructive" : "secondary"}
        className="h-fit gap-1.5 px-3 py-1 text-sm font-medium"
      >
        <Clock className="h-3.5 w-3.5" />
        Draw in {daysUntilDraw} {daysUntilDraw === 1 ? "day" : "days"} ·{" "}
        {nextDrawDate}
      </Badge>
    </PageHeader>
  )
}

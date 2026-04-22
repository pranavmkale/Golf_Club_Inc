"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/scores": "My Scores",
  "/draws": "Draws",
  "/charity": "Charity",
  "/winnings": "Winnings",
  "/settings": "Settings",
  "/settings/subscription": "Subscription",
  "/settings/charity": "Charity Settings",
  // Admin routes
  "/admin": "Overview",
  "/admin/users": "User Audit",
  "/admin/draws": "Draw Control",
  "/admin/charities": "Charities",
  "/admin/winners": "Verification",
}

export function DashboardBreadcrumb() {
  const pathname = usePathname()

  // Build segments: e.g. /dashboard/scores → ["Dashboard", "My Scores"]
  const segments = pathname.split("/").filter(Boolean)
  const crumbs: { label: string; href: string }[] = []

  let current = ""
  for (const seg of segments) {
    current += `/${seg}`
    crumbs.push({
      label: routeLabels[current] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
      href: current,
    })
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem className={i < crumbs.length - 1 ? "hidden md:block" : ""}>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

"use client"

import { usePathname } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isSettingsRoot = pathname === "/settings"

  return (
    <div className="flex flex-col gap-6 px-4">
      {isSettingsRoot && (
        <PageHeader
          title="Settings"
          description="Control your application behavior and security."
        />
      )}
      {children}
    </div>
  )
}

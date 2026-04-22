import { PageHeader } from "@/components/layout/page-header"
import { Card } from "@/components/ui/card"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile - Luma",
  description: "View and manage your personal profile information.",
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Profile"
        description="Manage your account and preferences."
      />
      <Card className="flex-1 p-6 shadow-none">
        {children}
      </Card>
    </div>
  )
}

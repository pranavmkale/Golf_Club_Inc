import { PageHeader } from "@/components/layout/page-header"

interface CharityPageHeaderProps {
  charityName: string | null
}

export function CharityPageHeader({ charityName }: CharityPageHeaderProps) {
  return (
    <PageHeader
      title="My Charity"
      description={
        charityName
          ? `Supporting ${charityName} this month.`
          : "No charity selected yet."
      }
    />
  )
}

import { PublicNavbar } from "@/components/landing/public-navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PublicNavbar />
      {children}
    </>
  )
}

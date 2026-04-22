"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { CharityBrowserDialog } from "./charity-browser-dialog"
import type { Charity } from "@/lib/types/database"

interface SelectCharityClientProps {
  charities: Charity[]
}

export function SelectCharityClient({ charities }: SelectCharityClientProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        size="lg" 
        className="font-bold px-8 shadow-lg shadow-primary/20"
      >
        Browse charities
      </Button>
      <CharityBrowserDialog
        charities={charities}
        currentCharityId={null}
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {}} // Revalidation handled by server action
      />
    </>
  )
}

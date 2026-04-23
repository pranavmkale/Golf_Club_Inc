"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { format } from "date-fns"

export function ExportSection() {
  const [exporting, setExporting] = useState<string | null>(null)

  const handleExport = async (type: string) => {
    setExporting(type)
    try {
      const response = await fetch(`/api/admin/export/${type}`)
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}-${format(new Date(), "yyyy-MM-dd")}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export failed:", error)
      alert(`Export ${type} failed. Please try again.`)
    } finally {
      setExporting(null)
    }
  }

  const exportButtons = [
    { type: "users", label: "Export Users (CSV)" },
    { type: "draws", label: "Export Draws (CSV)" },
    { type: "winners", label: "Export Winners (CSV)" },
    { type: "charities", label: "Export Charities (CSV)" },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>Download platform data for external analysis</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {exportButtons.map(({ type, label }) => (
          <Button
            key={type}
            variant="outline"
            className="gap-2"
            onClick={() => handleExport(type)}
            disabled={exporting === type}
          >
            {exporting === type ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                {label}
              </>
            )}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Loader2, Edit2 } from "lucide-react"
import { toast } from "sonner"
import type { Charity } from "@/lib/types/database"

interface CharityDialogProps {
  charity?: Charity | null
  mode: "add" | "edit"
  trigger?: React.ReactNode
}

export function CharityDialog({ charity, mode, trigger }: CharityDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: charity?.name || "",
    description: charity?.description || "",
    logo_url: charity?.logo_url || "",
    cover_image_url: charity?.cover_image_url || "",
    website_url: charity?.website_url || "",
    is_featured: charity?.is_featured || false,
    is_active: charity?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = mode === "add" ? "/api/admin/charities" : `/api/admin/charities/${charity?.id}`
      const method = mode === "add" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${mode} charity`)
      }

      toast.success(mode === "add" ? "Charity created" : "Charity updated", {
        description: `"${formData.name}" has been ${mode === "add" ? "added" : "updated"}.`,
      })

      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async () => {
    if (mode !== "edit" || !charity) return

    const newActiveState = !formData.is_active
    setFormData((prev) => ({ ...prev, is_active: newActiveState }))

    try {
      const response = await fetch(`/api/admin/charities/${charity.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newActiveState }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status")
      }

      toast.success(newActiveState ? "Charity activated" : "Charity deactivated", {
        description: `"${charity.name}" is now ${newActiveState ? "active" : "inactive"}.`,
      })

      router.refresh()
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      })
      // Revert on error
      setFormData((prev) => ({ ...prev, is_active: !newActiveState }))
    }
  }

  const handleToggleFeatured = async () => {
    if (mode !== "edit" || !charity) return

    const newFeaturedState = !formData.is_featured
    setFormData((prev) => ({ ...prev, is_featured: newFeaturedState }))

    try {
      const response = await fetch(`/api/admin/charities/${charity.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: newFeaturedState }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update featured status")
      }

      toast.success(newFeaturedState ? "Charity featured" : "Charity unfeatured", {
        description: `"${charity.name}" is now ${newFeaturedState ? "featured" : "not featured"}.`,
      })

      router.refresh()
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      })
      setFormData((prev) => ({ ...prev, is_featured: !newFeaturedState }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 shadow-lg shadow-primary/20">
            {mode === "add" ? (
              <>
                <Plus className="h-4 w-4" />
                Add New Charity
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "add" ? "Add New Charity" : "Edit Charity"}</DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "Create a new charity for users to support."
                : "Update charity details and settings."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Red Cross"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the charity's mission and impact..."
                rows={3}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                value={formData.website_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, website_url: e.target.value }))}
                placeholder="https://example.org"
                type="url"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={formData.logo_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="https://..."
                  type="url"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cover">Cover Image URL</Label>
                <Input
                  id="cover"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cover_image_url: e.target.value }))}
                  placeholder="https://..."
                  type="url"
                />
              </div>
            </div>
            {mode === "edit" && (
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label>Active Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Inactive charities are hidden from users
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={handleToggleActive}
                />
              </div>
            )}
            {mode === "edit" && (
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label>Featured</Label>
                  <p className="text-xs text-muted-foreground">
                    Featured charities appear on the homepage
                  </p>
                </div>
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={handleToggleFeatured}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : mode === "add" ? (
                "Create Charity"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

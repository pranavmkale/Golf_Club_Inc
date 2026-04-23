"use client"

import * as React from "react"
import { Camera, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"

interface AvatarUploadProps {
  avatarUrl?: string | null
  fullName?: string
  initials: string
  userId: string
}

export function AvatarUpload({
  avatarUrl,
  fullName,
  initials,
  userId,
}: AvatarUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(avatarUrl ?? null)
  const [isUploading, setIsUploading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    if (
      !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        file.type
      )
    ) {
      alert("Please upload a JPG, PNG, GIF or WebP image.")
      return
    }
    if (file.size > 800 * 1024) {
      alert("File must be under 800KB.")
      return
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setIsUploading(true)

    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop()
      const path = `${userId}/avatar.${ext}`

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path)

      // Update profile
      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId)

      setPreview(publicUrl)
    } catch (err) {
      console.error("Avatar upload failed:", err)
      setPreview(avatarUrl ?? null) // revert preview on error
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div
      className="group relative h-24 w-24 cursor-pointer"
      onClick={() => inputRef.current?.click()}
    >
      <Avatar className="h-24 w-24">
        <AvatarImage src={preview ?? undefined} alt={fullName} />
        <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {isUploading ? (
          <Loader2 className="h-7 w-7 animate-spin text-white" />
        ) : (
          <Camera className="h-7 w-7 text-white" />
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  )
}

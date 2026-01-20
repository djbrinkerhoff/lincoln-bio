"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef } from "react"

interface Profile {
  username?: string | null
  displayName?: string | null
  bio?: string | null
  profileImage?: string | null
}

interface ProfileFormProps {
  profile: Profile
  onChange: (profile: Profile) => void
  saving?: boolean
}

export function ProfileForm({ profile, onChange, saving }: ProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const displayName = profile.displayName || profile.username || "User"
  const initials = displayName.slice(0, 2).toUpperCase()

  const handleChange = (field: keyof Profile, value: string) => {
    onChange({ ...profile, [field]: value || null })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      const { url } = await response.json()
      onChange({ ...profile, profileImage: url })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={profile.profileImage || undefined} alt={displayName} />
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Change photo
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            value={profile.displayName || ""}
            onChange={(e) => handleChange("displayName", e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-2">lincolnbio.app/</span>
            <Input
              id="username"
              value={profile.username || ""}
              onChange={(e) => handleChange("username", e.target.value.toLowerCase())}
              placeholder="username"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            value={profile.bio || ""}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Tell people about yourself"
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background resize-none"
          />
        </div>
      </div>

      {saving && (
        <p className="text-sm text-muted-foreground">Saving...</p>
      )}
    </div>
  )
}

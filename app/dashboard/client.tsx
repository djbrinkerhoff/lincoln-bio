"use client"

import { useState, useCallback } from "react"
import { signOut } from "next-auth/react"
import { ProfileForm } from "@/components/profile-form"
import { LinkList } from "@/components/link-list"
import { BioPage } from "@/components/bio-page"
import { Button } from "@/components/ui/button"
import { useDebouncedSave } from "@/lib/use-debounced-save"

interface Link {
  id: string
  title: string
  url: string
  isActive: boolean
}

interface Profile {
  username?: string | null
  displayName?: string | null
  bio?: string | null
  profileImage?: string | null
}

interface InitialData {
  profile: Profile
  links: Link[]
}

export function DashboardClient({ initialData }: { initialData: InitialData }) {
  const [profile, setProfile] = useState<Profile>(initialData.profile)
  const [links, setLinks] = useState<Link[]>(initialData.links)

  const saveProfile = useCallback(async () => {
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
  }, [profile])

  const saveLinks = useCallback(async () => {
    await fetch("/api/links", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ links, order: links.map((l) => l.id) }),
    })
  }, [links])

  const { save: debouncedSaveProfile, saving: savingProfile } = useDebouncedSave(saveProfile)
  const { save: debouncedSaveLinks, saving: savingLinks } = useDebouncedSave(saveLinks)

  const handleProfileChange = (newProfile: Profile) => {
    setProfile(newProfile)
    debouncedSaveProfile()
  }

  const handleLinksChange = (newLinks: Link[]) => {
    setLinks(newLinks)
    debouncedSaveLinks()
  }

  const handleAddLink = async () => {
    const response = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Link", url: "https://" }),
    })

    if (response.ok) {
      const newLink = await response.json()
      setLinks([...links, newLink])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Lincoln Bio</h1>
          <div className="flex items-center gap-4">
            {profile.username && (
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:underline"
              >
                View page
              </a>
            )}
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ProfileForm
              profile={profile}
              onChange={handleProfileChange}
              saving={savingProfile}
            />
            <LinkList
              links={links}
              onChange={handleLinksChange}
              onAdd={handleAddLink}
              saving={savingLinks}
            />
          </div>

          <div className="hidden lg:block sticky top-8 self-start">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b">
                <p className="text-sm text-muted-foreground">Preview</p>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-auto">
                <BioPage profile={profile} links={links} isPreview />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

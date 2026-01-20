import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BioLink } from "@/components/bio-link"

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

interface BioPageProps {
  profile: Profile
  links: Link[]
  isPreview?: boolean
}

export function BioPage({ profile, links, isPreview }: BioPageProps) {
  const displayName = profile.displayName || profile.username || "User"
  const initials = displayName.slice(0, 2).toUpperCase()
  const activeLinks = links.filter((link) => link.isActive)

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src={profile.profileImage || undefined} alt={displayName} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            {profile.bio && (
              <p className="text-muted-foreground mt-2">{profile.bio}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {activeLinks.map((link) => (
            <BioLink
              key={link.id}
              title={link.title}
              url={link.url}
              isPreview={isPreview}
            />
          ))}
          {activeLinks.length === 0 && (
            <p className="text-center text-muted-foreground">No links yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

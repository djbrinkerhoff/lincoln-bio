import { notFound } from "next/navigation"
import { Metadata } from "next"
import { prisma } from "@/lib/db"
import { BioPage } from "@/components/bio-page"

export const revalidate = false // Use on-demand revalidation only

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateStaticParams() {
  const users = await prisma.user.findMany({
    where: { username: { not: null } },
    select: { username: true },
    take: 1000,
  })
  return users.map((user) => ({ username: user.username! }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const user = await getUser(username)

  if (!user) {
    return { title: "Not Found" }
  }

  const displayName = user.displayName || user.username || "User"

  return {
    title: `${displayName} | Lincoln Bio`,
    description: user.bio || `Check out ${displayName}'s links`,
    openGraph: {
      title: displayName,
      description: user.bio || `Check out ${displayName}'s links`,
      images: user.profileImage ? [user.profileImage] : [],
    },
  }
}

export default async function UserPage({ params }: PageProps) {
  const { username } = await params
  const user = await getUser(username)

  if (!user) {
    notFound()
  }

  return <BioPage profile={user} links={user.links} />
}

async function getUser(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      links: {
        where: { isActive: true },
      },
    },
  })

  if (!user) return null

  // Sort links by order
  const order: string[] = JSON.parse(user.linkOrder || "[]")
  const sortedLinks = order.length > 0
    ? order
        .map((id) => user.links.find((l) => l.id === id))
        .filter((l): l is NonNullable<typeof l> => l !== undefined)
    : user.links

  return {
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    profileImage: user.profileImage,
    links: sortedLinks.map((l) => ({
      id: l.id,
      title: l.title,
      url: l.url,
      isActive: l.isActive,
    })),
  }
}

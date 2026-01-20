import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardClient } from "./client"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      links: {
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  // Sort links by linkOrder if present
  const linkOrder: string[] = JSON.parse(user.linkOrder || "[]")
  const sortedLinks = linkOrder.length > 0
    ? linkOrder
        .map((id) => user.links.find((l) => l.id === id))
        .filter((l): l is NonNullable<typeof l> => l !== undefined)
        .concat(user.links.filter((l) => !linkOrder.includes(l.id)))
    : user.links

  const initialData = {
    profile: {
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      profileImage: user.profileImage,
    },
    links: sortedLinks.map((l) => ({
      id: l.id,
      title: l.title,
      url: l.url,
      isActive: l.isActive,
    })),
  }

  return <DashboardClient initialData={initialData} />
}

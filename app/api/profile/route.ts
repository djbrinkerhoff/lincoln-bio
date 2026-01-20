import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { updateProfileSchema } from "@/lib/schemas"
import { revalidatePath } from "next/cache"

export async function PATCH(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = updateProfileSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 })
  }

  const { username, displayName, bio, profileImage } = parsed.data

  // Check username uniqueness
  if (username) {
    const existing = await prisma.user.findFirst({
      where: {
        username,
        NOT: { id: session.user.id },
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    }

    // Check for reserved usernames
    const reserved = ["admin", "api", "dashboard", "login", "logout", "settings", "help", "about"]
    if (reserved.includes(username)) {
      return NextResponse.json({ error: "This username is reserved" }, { status: 400 })
    }
  }

  // Get current username for revalidation
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true },
  })

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      username,
      displayName,
      bio,
      profileImage,
    },
  })

  // Revalidate public pages
  if (currentUser?.username) {
    revalidatePath(`/${currentUser.username}`)
  }
  if (username && username !== currentUser?.username) {
    revalidatePath(`/${username}`)
  }

  return NextResponse.json({
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    profileImage: user.profileImage,
  })
}

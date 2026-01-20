import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createLinkSchema } from "@/lib/schemas"
import { revalidatePath } from "next/cache"

// Create a new link
export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = createLinkSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 })
  }

  const link = await prisma.link.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      url: parsed.data.url,
    },
  })

  // Add to linkOrder
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { linkOrder: true, username: true },
  })

  const order: string[] = JSON.parse(user?.linkOrder || "[]")
  order.push(link.id)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { linkOrder: JSON.stringify(order) },
  })

  // Revalidate public page
  if (user?.username) {
    revalidatePath(`/${user.username}`)
  }

  return NextResponse.json({
    id: link.id,
    title: link.title,
    url: link.url,
    isActive: link.isActive,
  })
}

// Update links (batch update with order)
export async function PUT(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { links, order } = body as {
    links: { id: string; title: string; url: string; isActive: boolean }[]
    order: string[]
  }

  // Update each link
  for (const link of links) {
    await prisma.link.updateMany({
      where: {
        id: link.id,
        userId: session.user.id,
      },
      data: {
        title: link.title,
        url: link.url,
        isActive: link.isActive,
      },
    })
  }

  // Update linkOrder
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { linkOrder: JSON.stringify(order) },
    select: { username: true },
  })

  // Revalidate public page
  if (user.username) {
    revalidatePath(`/${user.username}`)
  }

  return NextResponse.json({ success: true })
}

// Delete a link
export async function DELETE(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { id } = body as { id: string }

  // Delete link
  await prisma.link.deleteMany({
    where: {
      id,
      userId: session.user.id,
    },
  })

  // Clean up linkOrder
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { linkOrder: true, username: true },
  })

  const order: string[] = JSON.parse(user?.linkOrder || "[]")
  const cleanedOrder = order.filter((linkId) => linkId !== id)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { linkOrder: JSON.stringify(cleanedOrder) },
  })

  // Revalidate public page
  if (user?.username) {
    revalidatePath(`/${user.username}`)
  }

  return NextResponse.json({ success: true })
}

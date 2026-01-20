import { z } from "zod"

export const urlSchema = z.string().url().max(2048).refine(
  (url) => {
    try {
      const parsed = new URL(url)
      return ["http:", "https:"].includes(parsed.protocol)
    } catch {
      return false
    }
  },
  "Only HTTP/HTTPS URLs allowed"
)

export const createLinkSchema = z.object({
  title: z.string().min(1).max(100).trim(),
  url: urlSchema,
})

export const updateLinkSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100).trim().optional(),
  url: urlSchema.optional(),
  isActive: z.boolean().optional(),
})

export const updateProfileSchema = z.object({
  displayName: z.string().max(50).trim().optional(),
  bio: z.string().max(500).trim().optional(),
  username: z.string()
    .min(3).max(30)
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only")
    .optional(),
  profileImage: z.string().url().optional().nullable(),
})

export const updateLinkOrderSchema = z.object({
  order: z.array(z.string()),
})

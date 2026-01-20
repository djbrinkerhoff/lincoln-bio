import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import type { Provider } from "next-auth/providers"

// Development email provider that logs magic links to console
const DevEmailProvider: Provider = {
  id: "email",
  name: "Email",
  type: "email",
  maxAge: 60 * 60, // 1 hour
  async sendVerificationRequest({ identifier: email, url }) {
    console.log("\n")
    console.log("=".repeat(60))
    console.log("MAGIC LINK LOGIN")
    console.log("=".repeat(60))
    console.log(`Email: ${email}`)
    console.log(`Click here to sign in: ${url}`)
    console.log("=".repeat(60))
    console.log("\n")
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [DevEmailProvider],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // @ts-expect-error - username is a custom field
        session.user.username = user.username
      }
      return session
    },
  },
})

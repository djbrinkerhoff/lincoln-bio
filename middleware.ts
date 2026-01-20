import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check for session token from NextAuth
  const sessionToken = request.cookies.get("authjs.session-token")?.value
    || request.cookies.get("__Secure-authjs.session-token")?.value

  const isProtected = request.nextUrl.pathname.startsWith("/dashboard")

  if (isProtected && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = { matcher: ["/dashboard/:path*"] }

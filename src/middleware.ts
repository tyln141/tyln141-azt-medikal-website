import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const session = req.cookies.get("admin_session")

  if (!session && req.nextUrl.pathname.startsWith("/secure-admin-login/dashboard")) {
    return NextResponse.redirect(new URL("/secure-admin-login", req.url))
  }

  return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};

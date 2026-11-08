// Optimistic redirect only: sends visitors without a session cookie to the admin sign-in page.
// This is NOT authorization (the cookie isn't validated, and server actions can bypass the matcher);
// every admin page and action must still call requireAdmin() from src/lib/admin-auth.ts.

import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const SIGN_IN_PATH = "/admin/sign-in";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === SIGN_IN_PATH) return NextResponse.next();
  if (getSessionCookie(request)) return NextResponse.next();
  return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};

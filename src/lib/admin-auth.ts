// Server-side admin authorization. Call requireAdmin() in every admin page/layout AND at the top of
// every admin server action and route handler; the proxy cookie check is only a UX redirect.

import { cache } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const ADMIN_SIGN_IN_PATH = "/admin/sign-in";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

/** The admin plugin stores roles as a comma-separated string (e.g. "admin,user"). */
export function hasAdminRole(role: string | null | undefined): boolean {
  return (role ?? "").split(",").some((r) => r.trim() === "admin");
}

/** Session for this request, or null. Deduplicated per request. */
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/** Returns the admin session; redirects to sign-in when logged out, 404s for non-admins. */
export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(ADMIN_SIGN_IN_PATH);
  if (!hasAdminRole(session.user.role)) notFound();
  return session;
}

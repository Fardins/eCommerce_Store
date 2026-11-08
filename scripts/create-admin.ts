// Creates the admin account, or promotes an existing user to admin. Safe to re-run.
// Usage: set ADMIN_EMAIL, ADMIN_PASSWORD (min 8 chars) and optionally ADMIN_NAME in .env.local,
// then `npm run admin:create`. Public sign-up is disabled, so this is how staff accounts are made.

import { eq } from "drizzle-orm";

import { db } from "../src/db";
import { user } from "../src/db/schema";
import { auth } from "../src/lib/auth";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Admin";

  if (!email) throw new Error("ADMIN_EMAIL is not set.");

  const existing = await db.query.user.findFirst({ where: eq(user.email, email) });

  if (existing) {
    await db.update(user).set({ role: "admin" }).where(eq(user.id, existing.id));
    console.log(`Promoted existing user ${email} to admin.`);
    return;
  }

  if (!password || password.length < 8) throw new Error("ADMIN_PASSWORD must be set (min 8 characters) to create a new admin.");

  // Called without request headers, the admin plugin skips the session check (server-side bootstrap).
  await auth.api.createUser({ body: { email, password, name, role: "admin" } });
  console.log(`Created admin ${email}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";

import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    // Staff-only accounts: public sign-up is off. Create admins with `npm run admin:create`.
    disableSignUp: true,
  },
  plugins: [admin(), nextCookies()], // keep nextCookies last
});

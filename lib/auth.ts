import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendMagicLinkEmail } from "@/lib/mailer";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
      onboardingCompleted: {
        type: "boolean",
        defaultValue: false,
      },
      acceptedTerms: {
        type: "boolean",
        defaultValue: false,
      },
      preferredFormat: {
        type: "string",
        defaultValue: "Browser",
      },
      favoriteGenres: {
        type: "string",
        defaultValue: "",
      },
      ownedBooks: {
        type: "string",
        defaultValue: "",
      },
    },
  },
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        await sendMagicLinkEmail({ to: email, url });
      },
    }),
  ],
});

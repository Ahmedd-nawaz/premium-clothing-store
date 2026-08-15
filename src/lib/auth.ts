/**
 * Better Auth Configuration
 * Complete authentication setup with Prisma adapter, email/password, and session management
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail, sendVerificationEmail } from "@/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification stays off for now — flipping it on would
    // immediately lock out every account created during testing so far,
    // since none of them have emailVerified = true yet. Turn it on once
    // you're ready to enforce verification end-to-end.
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      // Not awaited on purpose — Better Auth's own docs recommend this
      // to avoid timing attacks (awaiting would let response time leak
      // whether an email address exists in the system).
      void sendResetPasswordEmail(user.email, url);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendVerificationEmail(user.email, url);
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      status: {
        type: "string",
      },
      phone: {
        type: "string",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
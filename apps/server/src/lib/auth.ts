import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins/email-otp";
import { prisma } from "../db/client";
import { userAdditionalFields } from "./auth-user-fields";

const isProduction = process.env.BETTER_AUTH_URL === 'https://api.deathroit.ravindertech.me';

export const authOptions = {
  baseURL: {
    allowedHosts: ["http://localhost:3000","localhost:3001", "https://deathroit.vercel.app", "https://deathroit.ravindertech.me", "https://api.deathroit.ravindertech.me"],

  }, // Express server URL
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email: _email, otp: _otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
      },
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      prompt: "select_account",
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  }
  ,
  trustedOrigins: ["http://localhost:3000", "https://deathroit.vercel.app", "https://deathroit.ravindertech.me", "https://api.deathroit.ravindertech.me"],

  advanced: {
    useSecureCookies: isProduction,

    crossSubDomainCookies: {
      enabled: isProduction,
      domain: `deathroit.ravindertech.me`,
    },


  },

  user: {
    additionalFields: userAdditionalFields,
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(authOptions);
export type Auth = typeof auth;

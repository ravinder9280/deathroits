import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins/email-otp";
import { prisma } from "../db/client";
import { userAdditionalFields } from "./auth-user-fields";
import { sendOtpEmail } from "./email";

const isProduction = process.env.BETTER_AUTH_URL === 'https://api.deathroit.ravindertech.me';

export const authOptions = {
  baseURL: {
    allowedHosts: ["http://localhost:3000", "localhost:3001", "https://deathroit.vercel.app", "https://deathroit.ravindertech.me", "https://api.deathroit.ravindertech.me"],

  }, // Express server URL

  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendOtpEmail({ to: email, otp, type });
      },
      // OTP is valid for 10 minutes
      otpLength: 6,
      expiresIn: 600,
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      prompt: "select_account",
      mapProfileToUser: (profile) => {
        return {
          role: "PLAYER", 
        };
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7 // 7 day
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

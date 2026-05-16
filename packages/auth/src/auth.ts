import { prisma } from "@monorepo/db";
import { type Auth, betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins/email-otp";

const authOptions: BetterAuthOptions = {
  baseURL: process.env.BETTER_AUTH_URL, // Express server URL
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  user:{

    additionalFields:{
      

    }
  },
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
  trustedOrigins: ["http://localhost:3000"],
};

export const auth: Auth = betterAuth(authOptions);

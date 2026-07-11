import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins/email-otp";
import { prisma } from "../db/client";
import { userAdditionalFields } from "./auth-user-fields";
import { sendOtpEmail } from "./email";
import { username } from "better-auth/plugins"
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
    username({
      minUsernameLength: 3,
      maxUsernameLength: 20,
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
   databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!user.username) {
            const generated = await generateUniqueUsername(user.name || user.email)
            return {
              data: {
                ...user,
                username: generated,          // normalized/lowercase form
                displayUsername: generated,   // what's shown to the user
              },
            }
          }
          return { data: user }
        },
      },
    },
  }
} satisfies BetterAuthOptions;


async function generateUniqueUsername(seed: string) {
  const base = seed
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12) || "player"

  let candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`

  // keep retrying until we find a free one
  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`
  }
  return candidate
}
export const auth = betterAuth(authOptions);
export type Auth = typeof auth;

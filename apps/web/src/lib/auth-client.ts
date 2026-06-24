import {
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { userAdditionalFields } from "../../../server/src/lib/auth-user-fields";

const authClientOptions = {
  baseURL: process.env.NEXT_PUBLIC_API_ORIGIN,
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include" as const,
  },
  plugins: [
    emailOTPClient(),
    inferAdditionalFields({
      user: userAdditionalFields,
    }),
  ],
};

const authClient: ReturnType<typeof createAuthClient<typeof authClientOptions>> =
  createAuthClient(authClientOptions);

export { authClient };
export const { signIn, signOut, useSession, emailOtp } = authClient;
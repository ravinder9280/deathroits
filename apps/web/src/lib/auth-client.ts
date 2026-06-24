import {
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { userAdditionalFields } from "../../../server/src/lib/auth-user-fields";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_ORIGIN,
  basePath: '/api/auth',
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    emailOTPClient(),
    inferAdditionalFields({
      user: userAdditionalFields,
    }),
  ],
});

export { authClient };
export const { signIn, signOut, useSession, emailOtp } = authClient;
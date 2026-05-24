import {
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { userAdditionalFields } from "../../../server/src/lib/auth-user-fields";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_ORIGIN,
  plugins: [
    emailOTPClient(),
    inferAdditionalFields({
      user: userAdditionalFields,
    }),
  ],
});

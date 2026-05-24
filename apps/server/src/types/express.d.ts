import type { auth } from "../lib/auth";

type SessionUser = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>["user"];

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: SessionUser;
    }
  }
}

export {};

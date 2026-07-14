import { z } from "zod";

export const chatSendSchema = z.object({
  message: z.string().trim().min(1).max(500),
});

export type ChatSendPayload = z.infer<typeof chatSendSchema>;

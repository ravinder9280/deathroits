import { z } from "zod";

export const chatSendSchema = z.object({
  message: z.string().trim().min(1).max(500),
  guestId: z.string().optional(),
  guestName: z.string().trim().max(30).optional(),
});

export type ChatSendPayload = z.infer<typeof chatSendSchema>;

import type { Request, Response } from "express";

import { prisma } from "../db/client";

export const getChatHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const cursor =
    typeof req.query.cursor === "string" ? req.query.cursor : undefined;
  const limit = Math.min(Number(req.query.limit) || 50, 100);

  const messages = await prisma.chatMessage.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      user: {
        select: {
          id: true,
          name: true,
          displayUsername: true,
          username: true,
          image: true,
        },
      },
    },
  });

  // Return oldest-first for the client to render top-to-bottom
  res.json({
    messages: messages.reverse().map((m) => ({
      id: m.id,
      message: m.message,
      userId: m.userId,
      user: m.user
        ? {
            id: m.user.id,
            name: m.user.name,
            username: m.user.displayUsername ?? m.user.username,
            image: m.user.image,
          }
        : null,
      guestId: m.guestId,
      guestName: m.guestName,
      createdAt: m.createdAt.toISOString(),
    })),
  });
};

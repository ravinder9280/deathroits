import "dotenv/config";
import * as http from "node:http";
import { DefaultEventsMap, Server } from "socket.io";

import app from "./app";
import { registerChatHandlers } from "./socket/chat.handler";
import { resolveSocketIdentity } from "./socket/identity.middleware";
import type { SocketData } from "./types/socket.types";

const port = Number(process.env.PORT) || 3001;

const init = async (): Promise<void> => {
  const server = http.createServer(app);

  const io = new Server<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    SocketData
  >(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://deathroit.vercel.app",
        "https://deathroit.ravindertech.me",
      ],
      credentials: true,
    },
  });

  // Resolve identity once per connection before any handlers run
  io.use(resolveSocketIdentity);

  io.on("connection", (socket) => {
    registerChatHandlers(io, socket);
  });

  server.listen(port, "::", () => {
    console.log(`API http server running on port ${port}`);
  });
};

init().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});

import "dotenv/config";
import * as http from "node:http";
import { Server } from "socket.io";

import app from "./app";
import { registerChatHandlers } from "./socket/chat.handler";

const port = Number(process.env.PORT) || 3001;

const init = async (): Promise<void> => {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://deathroit.vercel.app",
        "https://deathroit.ravindertech.me",
      ],
      credentials: true,
    },
  });

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


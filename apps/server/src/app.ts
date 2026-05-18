import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import routes from "./routes";
import { auth } from "./lib/auth";
const app: express.Express = express();

app.use(morgan("tiny"));
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: ["http://localhost:3000", "https://deathroit.vercel.app"],
  }),
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json({ limit: "100mb" }));

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.get("/", (req, res) => {
  res.send("server running");
});

app.use("/v1", routes);

export default app;

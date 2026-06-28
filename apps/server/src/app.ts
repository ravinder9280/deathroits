import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import multer from "multer";

import { auth } from "./lib/auth";
import routes from "./routes";
import { AppError } from "./utils/app-error";
const app: express.Express = express();

app.use(morgan("tiny"));
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: ["http://localhost:3000", "https://deathroit.vercel.app","https://deathroit.ravindertech.me"],
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

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        error: err.message,
        ...(err.code ? { code: err.code } : {}),
      });
      return;
    }
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({ error: "File too large" });
        return;
      }
      res.status(400).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  },
);


export default app;

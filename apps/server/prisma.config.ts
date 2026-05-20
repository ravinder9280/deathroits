import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    url: process.env["DIRECT_URL"],
  },
  migrations: {
    path: "src/db/prisma/migrations",
  },
  schema: "src/db/prisma/schema.prisma",
});
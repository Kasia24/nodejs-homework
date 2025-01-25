import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));

import express from "express";
import morgan from "morgan";
import { usersRouter } from "./api/users.js";
import { jwtsRouter } from "./api/jwts.js";
import { auth } from "./middlewares/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const createServer = () => {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.static(join(__dirname, "public")));

  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/jwts", auth(), jwtsRouter);

  app.use(errorHandler);

  return app;
};

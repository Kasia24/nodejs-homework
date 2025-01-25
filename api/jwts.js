import { Router } from "express";
import { JWT } from "../lib/jwt.js";

export const jwtsRouter = Router();

jwtsRouter.get("/", async (req, res) => {
  const message = `Hello there 👋 @${new Date().toISOString()}`;
  const dataPayload = { message };

  const token = await JWT.sign(dataPayload);

  return res.json({ token });
});

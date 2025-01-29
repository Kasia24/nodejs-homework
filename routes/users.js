import express from "express";
import {
  signup,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
} from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", auth, logout);
router.get("/current", auth, getCurrentUser);
router.patch("/", auth, updateSubscription);

export default router;

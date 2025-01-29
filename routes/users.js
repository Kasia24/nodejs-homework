const express = require("express");
const {
  signup,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
} = require("../controllers/users.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", auth, logout);
router.get("/current", auth, getCurrentUser);
router.patch("/", auth, updateSubscription);

export default router;

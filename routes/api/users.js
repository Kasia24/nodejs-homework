const express = require("express");
const router = express.Router();
const { signupUser, loginUser } = require("../controllers/userController");

// Trasa rejestracji użytkownika
router.post("/signup", signupUser);

// Trasa logowania użytkownika
router.post("/login", loginUser);

module.exports = router;

const express = require("express");
const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("..//../middlewares/auth");
const router = express.Router();

// Walidacja dla rejestracji
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Endpoint rejestracji
router.post("/signup", async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: "Email in use" });

  const newUser = new User({ email, password });
  await newUser.save();

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
});

// Walidacja dla logowania
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Endpoint logowania
router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: "Email or password is wrong" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.status(401).json({ message: "Email or password is wrong" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  user.token = token;
  await user.save();

  res.status(200).json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
});

module.exports = router;

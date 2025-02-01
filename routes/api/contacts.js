const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const gravatar = require("gravatar");
const User = require("../models/user");
const auth = require("../middlewares/auth");

const router = express.Router();

// Walidacja rejestracji i logowania
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Rejestracja użytkownika
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    // Generowanie URL do awatara z Gravatar
    const avatarURL = gravatar.url(email, {
      s: "200", // Rozmiar awatara (200px)
      r: "pg", // Jakość (PG - "Parental Guidance")
      d: "mm", // Domyślny obrazek (w razie braku awatara)
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL, // Zapisujemy URL awatara w bazie danych
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Logowanie użytkownika
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Wylogowanie użytkownika
router.get("/logout", auth, async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Obecny użytkownik
router.get("/current", auth, (req, res) => {
  const { email, subscription, avatarURL } = req.user;
  res.status(200).json({ email, subscription, avatarURL });
});

// Aktualizacja subskrypcji użytkownika
router.patch("/", auth, async (req, res) => {
  const { subscription } = req.body;

  if (!["starter", "pro", "business"].includes(subscription)) {
    return res.status(400).json({ message: "Invalid subscription value" });
  }

  try {
    req.user.subscription = subscription;
    await req.user.save();
    res.status(200).json({ subscription: req.user.subscription });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

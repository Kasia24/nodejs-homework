const express = require("express");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const gravatar = require("gravatar");
const User = require("../models/user"); // Model użytkownika

const router = express.Router();

// Walidacja rejestracji
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Rejestracja użytkownika
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Walidacja danych wejściowych
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Sprawdzanie, czy użytkownik o danym emailu już istnieje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    // Generowanie URL do awatara z Gravatar na podstawie emaila
    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

    // Haszowanie hasła przed zapisaniem w bazie
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowego użytkownika z awatarem
    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL, // Zapisanie avatarURL w bazie danych
    });

    // Zwrócenie odpowiedzi z danymi użytkownika
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

module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const User = require("../models/user");

const router = express.Router();

// Rejestracja użytkownika
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sprawdzamy, czy użytkownik już istnieje
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generowanie URL do awatara z Gravatar
    const avatarURL = gravatar.url(email, {
      s: "200", // Rozmiar awatara
      r: "pg", // Jakość awatara
      d: "mm", // Domyślny awatar
    });

    // Szyfrowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzymy nowego użytkownika
    const newUser = new User({
      email,
      password: hashedPassword,
      avatarURL, // Przechowujemy URL awatara
    });

    // Zapisujemy użytkownika do bazy danych
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      avatarURL: newUser.avatarURL, // Zwracamy URL awatara
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

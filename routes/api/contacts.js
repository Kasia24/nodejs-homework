const express = require("express");
const Joi = require("joi");
const Contact = require("../../models/contact");
const auth = require("../../middlewares/auth");
const gravatar = require("gravatar");

const router = express.Router();

// Walidacja danych wejściowych
const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .required(),
  favorite: Joi.boolean(),
});

// Tworzenie nowego kontaktu z automatycznym generowaniem awatara
router.post("/", auth, async (req, res) => {
  const { name, email, phone, favorite } = req.body;

  // Walidacja danych
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Generowanie URL do awatara z Gravatar
  const avatarURL = gravatar.url(email, {
    s: "200", // Rozmiar awatara (200px)
    r: "pg", // Jakość (PG - "Parental Guidance")
    d: "mm", // Domyślny obrazek (Mystery Man)
  });

  try {
    const newContact = await Contact.create({
      name,
      email,
      phone,
      favorite,
      avatarURL, // Przechowujemy URL awatara w bazie danych
      owner: req.user.id, // Przypisanie kontaktu do zalogowanego użytkownika
    });

    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

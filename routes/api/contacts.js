const express = require("express");
const gravatar = require("gravatar");
const Contact = require("../models/contact");
const Joi = require("joi");

const router = express.Router(); // Tutaj tworzysz router

// Walidacja kontaktu
const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .required(),
  favorite: Joi.boolean(),
});

// Endpoint dodania kontaktu
router.post("/contacts", async (req, res) => {
  const { name, email, phone, favorite } = req.body;

  // Walidacja danych
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Generowanie URL do awatara z Gravatar
  const avatarURL = gravatar.url(email, {
    s: "200", // Rozmiar awatara
    r: "pg", // Jakość
    d: "mm", // Domyślny obrazek
  });

  try {
    const newContact = await Contact.create({
      name,
      email,
      phone,
      favorite,
      avatarURL, // Zapisujemy URL awatara w bazie
    });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; // Eksportujesz router, aby móc używać go w innych plikach

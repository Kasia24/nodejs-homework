const express = require("express");
const router = express.Router();
const Contact = require("../models/contact"); // Model kontaktu

// GET: Pobierz wszystkie kontakty
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find(); // Pobiera wszystkie kontakty
    res.json(contacts); // Zwraca kontakty jako odpowiedź
  } catch (err) {
    res.status(500).json({ message: "Error fetching contacts" });
  }
});

// POST: Dodaj nowy kontakt
router.post("/", async (req, res) => {
  const { name, email, phone, favorite } = req.body;

  try {
    const newContact = new Contact({ name, email, phone, favorite });
    await newContact.save(); // Zapisuje nowy kontakt w bazie
    res.status(201).json(newContact); // Zwraca nowo utworzony kontakt
  } catch (err) {
    res.status(400).json({ message: "Error creating contact" });
  }
});

module.exports = router;

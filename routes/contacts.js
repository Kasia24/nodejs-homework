const express = require("express");
const { addContact, getContacts } = require("../controllers/contactController"); // Import funkcji z kontrolera
const auth = require("../middlewares/auth"); // Middleware do autoryzacji użytkownika
const router = express.Router();

// Różne endpointy dla kontaktów
router.post("/", auth, addContact); // Dodawanie kontaktu wymaga autoryzacji
router.get("/", auth, getContacts); // Pobieranie kontaktów wymaga autoryzacji

module.exports = router;

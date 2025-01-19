const express = require("express");
const router = express.Router();
const { addContact, getContacts } = require("../controllers/contactController");
const { authenticateToken } = require("..//middlewares/auth"); // Middleware do autoryzacji

// Trasa dodawania kontaktu (z wymaganiem autoryzacji)
router.post("/add", authenticateToken, addContact);

// Trasa pobierania kontaktów (z wymaganiem autoryzacji)
router.get("/list", authenticateToken, getContacts);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
} = require("../controllers/contactsController");
const { authenticate } = require("../middleware/authenticate");

// Middleware autoryzacji
router.use(authenticate);

// GET /api/contacts - pobieranie kontaktów
router.get("/", getContacts);

// POST /api/contacts - tworzenie nowego kontaktu
router.post("/", createContact);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactsController");

// GET /api/contacts - Pobierz wszystkie kontakty
router.get("/", getContacts);

// GET /api/contacts/:id - Pobierz kontakt po ID
router.get("/:id", getContactById);

// POST /api/contacts - Utwórz nowy kontakt
router.post("/", createContact);

// PUT /api/contacts/:id - Zaktualizuj kontakt po ID
router.put("/:id", updateContact);

// DELETE /api/contacts/:id - Usuń kontakt po ID
router.delete("/:id", deleteContact);

module.exports = router;

const express = require("express");

const router = express.Router();

// Przykładowa lista kontaktów (w prawdziwej aplikacji dane będą pochodzić z bazy danych)
let contacts = [
  {
    id: "AeHIrLTr6JkxGE6SN-0Rw",
    name: "Allen Raymond",
    email: "nulla.ante@vestibul.co.uk",
    phone: "(992) 914-3792",
  },
  {
    id: "qdggE76Jtbfd9eWJHrssH",
    name: "Chaim Lewis",
    email: "dui.in@egetlacus.ca",
    phone: "(294) 840-6685",
  },
  {
    id: "drsAJ4SHPYqZeG-83QTVW",
    name: "Kennedy Lane",
    email: "mattis.Cras@nonenimMauris.net",
    phone: "(542) 451-7038",
  },
  // Dodaj więcej kontaktów, jeśli chcesz
];

// Trasa GET /api/contacts
router.get("/", async (req, res) => {
  try {
    res.json(contacts); // Zwracamy całą listę kontaktów
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Trasa GET /api/contacts/:contactId
router.get("/:contactId", async (req, res) => {
  const { contactId } = req.params; // Pobieramy contactId z URL
  const contact = contacts.find((c) => c.id === contactId); // Szukamy kontaktu o danym ID

  if (contact) {
    res.json(contact); // Jeśli znaleziono kontakt, zwróć go
  } else {
    res.status(404).json({ message: "Kontakt nie został znaleziony" }); // Jeśli nie znaleziono kontaktu, zwróć błąd 404
  }
});

// Inne trasy (POST, DELETE, PUT) możesz dodać podobnie jak wcześniej...

module.exports = router;

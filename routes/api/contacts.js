const express = require("express");

const router = express.Router();

// Przykładowa lista kontaktów (w rzeczywistej aplikacji będzie to baza danych)
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

// GET /api/contacts - Pobierz wszystkie kontakty
router.get("/", async (req, res, next) => {
  try {
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/contacts/:contactId - Pobierz kontakt po ID
router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = contacts.find((c) => c.id === contactId);

  if (contact) {
    res.json(contact); // Zwróć kontakt
  } else {
    res.status(404).json({ message: "Kontakt nie został znaleziony" }); // 404 jeśli nie znaleziono kontaktu
  }
});

// POST /api/contacts - Dodaj nowy kontakt
router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email i phone są wymagane" });
  }

  const newContact = {
    id: Date.now().toString(), // Prosty generator ID (oparty na czasie)
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  res.status(201).json(newContact); // Zwróć nowo dodany kontakt
});

// DELETE /api/contacts/:contactId - Usuń kontakt po ID
router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  contacts = contacts.filter((c) => c.id !== contactId); // Usuń kontakt o danym ID
  res.status(204).end(); // Brak zawartości, oznacza udaną operację
});

// PUT /api/contacts/:contactId - Zaktualizuj kontakt po ID
router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  const contactIndex = contacts.findIndex((c) => c.id === contactId);
  if (contactIndex !== -1) {
    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "Name, email i phone są wymagane" });
    }

    contacts[contactIndex] = { id: contactId, name, email, phone };
    res.json(contacts[contactIndex]); // Zwróć zaktualizowany kontakt
  } else {
    res.status(404).json({ message: "Kontakt nie został znaleziony" }); // 404 jeśli nie znaleziono kontaktu
  }
});

module.exports = router;

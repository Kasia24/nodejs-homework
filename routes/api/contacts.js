const express = require("express");
const fs = require("fs"); // Moduł do pracy z plikami
const path = require("path"); // Moduł do manipulacji ścieżkami plików

const router = express.Router();

// Funkcja do odczytania danych z pliku JSON
const getContacts = () => {
  const contactsFilePath = path.join(__dirname, "models", "contacts.json"); // Ścieżka względna
  const data = fs.readFileSync(contactsFilePath, "utf-8"); // Wczytanie pliku JSON
  return JSON.parse(data); // Parsowanie danych JSON
};

// Funkcja do zapisu danych do pliku JSON
const saveContacts = (contacts) => {
  const contactsFilePath = path.join(__dirname, "models", "contacts.json"); // Ścieżka względna
  fs.writeFileSync(
    contactsFilePath,
    JSON.stringify(contacts, null, 2),
    "utf-8"
  ); // Zapisujemy dane w formacie JSON
};

// Trasa GET /api/contacts
router.get("/", async (req, res) => {
  try {
    const contacts = getContacts(); // Pobieramy dane kontaktów z pliku
    res.json(contacts); // Zwracamy całą listę kontaktów
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Trasa GET /api/contacts/:contactId
router.get("/:contactId", async (req, res) => {
  const { contactId } = req.params; // Pobieramy contactId z URL
  const contacts = getContacts(); // Pobieramy dane kontaktów z pliku
  const contact = contacts.find((c) => c.id === contactId); // Szukamy kontaktu o danym ID

  if (contact) {
    res.json(contact); // Jeśli znaleziono kontakt, zwróć go
  } else {
    res.status(404).json({ message: "Kontakt nie został znaleziony" }); // Jeśli nie znaleziono kontaktu, zwróć błąd 404
  }
});

// Trasa POST /api/contacts - Dodanie nowego kontaktu
router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res
      .status(400)
      .json({ message: "Name, email, and phone are required" });
  }

  const newContact = {
    id: Date.now().toString(), // Simple ID generator (using timestamp)
    name,
    email,
    phone,
  };

  try {
    const contacts = getContacts(); // Pobieramy dane z pliku
    contacts.push(newContact); // Dodajemy nowy kontakt
    saveContacts(contacts); // Zapisujemy zmiany do pliku
    res.status(201).json(newContact); // Zwracamy nowy kontakt
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Trasa DELETE /api/contacts/:contactId - Usunięcie kontaktu
router.delete("/:contactId", async (req, res) => {
  const { contactId } = req.params;

  try {
    const contacts = getContacts(); // Pobieramy dane kontaktów z pliku
    const updatedContacts = contacts.filter((c) => c.id !== contactId); // Usuwamy kontakt o danym ID

    if (contacts.length === updatedContacts.length) {
      return res.status(404).json({ message: "Kontakt nie został znaleziony" });
    }

    saveContacts(updatedContacts); // Zapisujemy zmiany w pliku
    res.status(204).end(); // No content, successful deletion
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Trasa PUT /api/contacts/:contactId - Aktualizacja kontaktu
router.put("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res
      .status(400)
      .json({ message: "Name, email, and phone are required" });
  }

  try {
    const contacts = getContacts(); // Pobieramy dane kontaktów z pliku
    const contactIndex = contacts.findIndex((c) => c.id === contactId);

    if (contactIndex !== -1) {
      contacts[contactIndex] = { id: contactId, name, email, phone };
      saveContacts(contacts); // Zapisujemy zmiany w pliku
      res.json(contacts[contactIndex]); // Zwracamy zaktualizowany kontakt
    } else {
      res.status(404).json({ message: "Kontakt nie został znaleziony" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

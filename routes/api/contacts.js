const express = require("express");

const router = express.Router();

// Sample in-memory contacts list
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
  // Add more contacts as needed...
];

// GET /api/contacts - Get all contacts
router.get("/", async (req, res) => {
  try {
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/contacts/:contactId - Get a specific contact by ID
router.get("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const contact = contacts.find((c) => c.id === contactId);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

// POST /api/contacts - Add a new contact
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
  contacts.push(newContact);
  res.status(201).json(newContact);
});

// DELETE /api/contacts/:contactId - Delete a specific contact by ID
router.delete("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  contacts = contacts.filter((c) => c.id !== contactId);
  res.status(204).end(); // No content, successful deletion
});

// PUT /api/contacts/:contactId - Update a contact by ID
router.put("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const contactIndex = contacts.findIndex((c) => c.id === contactId);
  if (contactIndex !== -1) {
    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "Name, email, and phone are required" });
    }
    contacts[contactIndex] = { id: contactId, name, email, phone };
    res.json(contacts[contactIndex]);
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

module.exports = router;

const Contact = require("../models/contact"); // Twój model kontaktu

// Funkcja do dodawania nowego kontaktu
async function addContact(req, res) {
  const { name, email, phone } = req.body;
  const owner = req.user._id; // Pobieramy właściciela kontaktu z danych użytkownika

  const contact = new Contact({
    name,
    email,
    phone,
    owner, // Powiązanie kontaktu z użytkownikiem
  });

  try {
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ message: "Error adding contact" });
  }
}

// Funkcja do pobierania kontaktów dla aktualnego użytkownika
async function getContacts(req, res) {
  const owner = req.user._id;

  try {
    const contacts = await Contact.find({ owner }); // Pobranie tylko kontaktów przypisanych do aktualnego użytkownika
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving contacts" });
  }
}

// Eksport funkcji
module.exports = {
  addContact,
  getContacts,
};

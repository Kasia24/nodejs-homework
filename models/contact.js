const mongoose = require("mongoose");

// Definicja schematu kontaktu
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  favorite: { type: Boolean, default: false },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;

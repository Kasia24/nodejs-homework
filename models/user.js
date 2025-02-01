const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  avatarURL: {
    type: String, // Nowe pole do przechowywania URL awatara
    default: "", // Ustawiamy domyślną wartość jako pusty string
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;

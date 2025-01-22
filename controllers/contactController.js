const Contact = require("../models/contacts");

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user._id });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const contact = new Contact({ name, email, phone, owner: req.user._id });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: "Bad request" });
  }
};

module.exports = { getContacts, createContact };

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

// Połączenie z MongoDB
mongoose.connect("mongodb://localhost:27017/contactsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Model kontaktu
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatar: String, // Ścieżka do awatara
});

const Contact = mongoose.model("Contact", ContactSchema);

// Ustawienie folderu publicznego do serwowania plików statycznych
app.use(express.static("public"));

// Konfiguracja Multera (przechowywanie plików w "public/avatars")
const storage = multer.diskStorage({
  destination: "public/avatars",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Endpoint do przesyłania awatarów
app.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Brak pliku do przesłania" });
  }

  // Możesz tutaj dodać aktualizację użytkownika w bazie danych
  const newContact = new Contact({
    name: req.body.name,
    email: req.body.email,
    avatar: `/avatars/${req.file.filename}`,
  });

  await newContact.save();

  res.json({
    message: "Awatar przesłany!",
    avatarUrl: `/avatars/${req.file.filename}`,
  });
});

// Start serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});

const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const jimp = require("jimp");
const { expressjwt: expressJwt } = require("express-jwt");

dotenv.config();

const app = express();
const PORT = 5000;

// Połączenie z MongoDB za pomocą zmiennej MONGO_URI
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Połączono z MongoDB");
  })
  .catch((err) => {
    console.error("Błąd połączenia z MongoDB:", err);
  });

// Model użytkownika
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatarURL: String, // Ścieżka do awatara
});

const User = mongoose.model("User", UserSchema);

// Ustawienia Multera
const storage = multer.diskStorage({
  destination: "tmp", // Pliki będą przechowywane tymczasowo w folderze tmp
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware do autentykacji
const authenticateJWT = expressJwt({
  secret: process.env.JWT_SECRET, // Użycie sekretu z pliku .env
  algorithms: ["HS256"],
});

// Endpoint aktualizacji awatara
app.patch(
  "/users/avatars",
  authenticateJWT,
  upload.single("avatar"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Brak pliku do przesłania" });
    }

    try {
      // Przetworzenie obrazu za pomocą Jimp (zmiana rozmiaru na 250x250)
      const image = await jimp.read(req.file.path);
      await image.resize(250, 250); // Zmiana rozmiaru

      // Zapisz obraz w folderze 'public/avatars' z unikalną nazwą
      const avatarFileName = Date.now() + ".png";
      const avatarPath = path.join(
        __dirname,
        "public",
        "avatars",
        avatarFileName
      );
      await image.writeAsync(avatarPath);

      // Znajdź użytkownika w bazie danych na podstawie tokenu
      const user = await User.findOne({ email: req.user.email });

      if (!user) {
        return res.status(404).json({ message: "Użytkownik nie znaleziony" });
      }

      // Zaktualizuj URL awatara w bazie danych
      user.avatarURL = `/avatars/${avatarFileName}`;
      await user.save();

      // Odpowiedź z nowym URL awatara
      res.status(200).json({
        avatarURL: user.avatarURL,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Coś poszło nie tak" });
    }
  }
);

// Ustawienia Express
app.use(express.static("public"));
app.use(express.json());

// Start serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});

module.exports = app;

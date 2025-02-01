const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jimp = require("jimp");
const User = require("./models/user");
const auth = require("./middlewares/auth");

const router = express.Router();

// Foldery do przechowywania plików
const tmpDir = path.join(__dirname, "tmp");
const avatarDir = path.join(__dirname, "public/avatars");

// Tworzenie folderów, jeśli nie istnieją
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

// Konfiguracja Multer do przechowywania plików tymczasowych
const storage = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint do aktualizacji awatara
router.patch(
  "/api/users/avatars",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Plik nie został przesłany" });
      }

      const filePath = req.file.path;
      const newFileName = `${req.user.id}_${Date.now()}.jpg`;
      const newPath = path.join(avatarDir, newFileName);

      // Przetwarzanie obrazu
      const image = await jimp.read(filePath);
      await image.resize(250, 250).writeAsync(newPath);

      // Pobranie starego awatara i usunięcie go
      const user = await User.findById(req.user.id);
      if (user.avatarURL && user.avatarURL !== "/avatars/default.jpg") {
        const oldPath = path.join(__dirname, "public", user.avatarURL);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Usunięcie pliku tymczasowego
      fs.unlink(filePath, (err) => {
        if (err) console.error("Błąd przy usuwaniu pliku:", err);
      });

      // Tworzenie URL dla nowego awatara
      const avatarURL = `${req.protocol}://${req.get(
        "host"
      )}/avatars/${newFileName}`;

      // Zapisanie nowego avatarURL w bazie danych
      await User.findByIdAndUpdate(req.user.id, { avatarURL });

      // Wysłanie odpowiedzi
      res.json({ avatarURL });
    } catch (error) {
      res.status(500).json({ message: "Błąd serwera" });
    }
  }
);

module.exports = router;

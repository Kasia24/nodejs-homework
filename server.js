const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/users");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const jimp = require("jimp");
const User = require("./models/user");
const auth = require("./middlewares/auth");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Upewnij się, że foldery tmp/ i public/avatars istnieją
const avatarDir = path.join(__dirname, "public/avatars");
const tmpDir = path.join(__dirname, "tmp");

if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Konfiguracja Multer
const storage = multer.diskStorage({
  destination: tmpDir, // Przechowywanie pliku tymczasowo w folderze tmp/
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint do aktualizacji awatara
app.patch(
  "/api/users/avatars",
  auth, // Użycie middleware auth
  upload.single("avatar"), // Odbiór jednego pliku obrazu
  async (req, res) => {
    try {
      // Sprawdzenie, czy plik został przesłany
      if (!req.file) {
        return res.status(400).json({ message: "Plik nie został przesłany" });
      }

      // Przetwarzanie obrazu przy pomocy Jimp (zmiana rozmiaru do 250x250)
      const filePath = req.file.path;
      const newFileName = `${req.user.id}_${Date.now()}.jpg`; // Unikalna nazwa pliku
      const newPath = path.join(avatarDir, newFileName); // Nowa ścieżka w folderze public/avatars

      const image = await jimp.read(filePath);
      await image.resize(250, 250).writeAsync(newPath); // Zmiana rozmiaru

      // Usuwanie tymczasowego pliku
      fs.unlinkSync(filePath);

      // Stworzenie URL do awatara
      const avatarURL = `/avatars/${newFileName}`;

      // Zaktualizowanie URL awatara w bazie danych użytkownika
      await User.findByIdAndUpdate(req.user.id, { avatarURL });

      // Odpowiedź z URL nowego awatara
      res.json({ avatarURL });
    } catch (error) {
      res.status(500).json({ message: "Błąd serwera" });
    }
  }
);

// Rute do obsługi kontaktów
app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

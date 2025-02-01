const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jimp = require("jimp");
const User = require("./models/user");
const auth = require("./middlewares/auth"); // Middleware do autoryzacji

// Folder do przechowywania plików tymczasowych
const tmpDir = path.join(__dirname, "tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Konfiguracja Multer
const storage = multer.diskStorage({
  destination: tmpDir, // Zapis pliku do folderu tmp
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint do aktualizacji awatara
app.patch(
  "/api/users/avatars",
  auth, // Autoryzacja
  upload.single("avatar"), // Przyjmujemy tylko jeden plik o nazwie "avatar"
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Plik nie został przesłany" });
      }

      const filePath = req.file.path;
      const newFileName = `${req.user.id}_${Date.now()}.jpg`;
      const newPath = path.join(__dirname, "public/avatars", newFileName);

      // Przetwarzanie obrazu
      const image = await jimp.read(filePath);
      await image.resize(250, 250).writeAsync(newPath);

      // Usuwanie pliku tymczasowego
      fs.unlinkSync(filePath);

      // URL do nowego awatara
      const avatarURL = `/avatars/${newFileName}`;

      // Zaktualizowanie pola avatarURL w bazie danych
      await User.findByIdAndUpdate(req.user.id, { avatarURL });

      // Odpowiedź z URL nowego awatara
      res.json({ avatarURL });
    } catch (error) {
      res.status(500).json({ message: "Błąd serwera" });
    }
  }
);

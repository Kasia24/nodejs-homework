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
const authMiddleware = require("./middleware/auth");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Multer setup
const storage = multer.diskStorage({
  destination: "tmp/",
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint do aktualizacji awatara
app.patch(
  "/api/users/avatars",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Plik nie został przesłany" });
      }

      const filePath = req.file.path;
      const newPath = path.join(__dirname, "public/avatars", req.file.filename);

      const image = await jimp.read(filePath);
      await image.resize(250, 250).writeAsync(newPath);

      fs.unlinkSync(filePath);

      const avatarURL = `/avatars/${req.file.filename}`;
      await User.findByIdAndUpdate(req.user.id, { avatarURL });

      res.json({ avatarURL });
    } catch (error) {
      res.status(500).json({ message: "Błąd serwera" });
    }
  }
);

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

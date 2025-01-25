const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth"); // Trasy dla uwierzytelniania
const contactRoutes = require("./routes/contacts"); // Trasy dla kontaktów
const path = require("path");

dotenv.config(); // Ładowanie zmiennych środowiskowych

const app = express();

// Middleware
app.use(cors()); // Obsługa CORS
app.use(express.json()); // Obsługa danych JSON w żądaniach
app.use(express.urlencoded({ extended: true })); // Obsługa danych urlencoded

// Połączenie z bazą danych MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Statyczne pliki (opcjonalne)
app.use(express.static(path.join(__dirname, "public")));

// Obsługa tras
app.use("/api/users", authRoutes); // Trasy związane z użytkownikami (rejestracja, logowanie itp.)
app.use("/api/contacts", contactRoutes); // Trasy związane z kontaktami

// Obsługa błędów 404 (trasa nieznaleziona)
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

// Obsługa błędów serwera
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// Uruchomienie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

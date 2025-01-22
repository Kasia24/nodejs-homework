const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Umożliwia połączenia CORS
const userRoutes = require("./routes/users"); // Trasy użytkowników
const Contacts = require("./routes/contacts"); // Trasy kontaktów
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Umożliwia połączenia z różnych źródeł
app.use(express.json()); // Obsługa JSON w ciele żądania
app.use(express.urlencoded({ extended: true })); // Obsługa form-urlencoded

// Statyczne pliki (np. pliki publiczne)
app.use(express.static(path.join(__dirname, "public")));

// Połączenie z bazą danych
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Zakończ proces w przypadku błędu
  });

// Konfiguracja tras
app.use("/api/users", userRoutes); // Ścieżka dla użytkowników
app.use("/api/contacts", Contacts); // Ścieżka dla kontaktów

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

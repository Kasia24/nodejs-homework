const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users"); // Trasy użytkowników
const contactRoutes = require("./routes/contacts"); // Trasy kontaktów
const path = require("path");

dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, "public")));

// Middleware
//app.use(express.json()); // Umożliwia obsługę JSON w ciele żądania
//app.use(cors()); // Umożliwia połączenia z różnych źródeł
app.use(express.json()); // Obsługa JSON
app.use(express.urlencoded({ extended: true })); // Obsługa form-urlencoded

// Połączenie z bazą danych
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Konfiguracja tras
app.use("/users", userRoutes); // Ścieżka dla użytkowników
app.use("/contacts", contactRoutes); // Ścieżka dla kontaktów

// Uruchomienie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contacts");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Połączenie z bazą danych
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

// Rejestracja tras
app.use("/api/users", authRoutes); // Endpointy rejestracji, logowania itd.
app.use("/api/contacts", contactRoutes); // Endpointy dla kontaktów

// Obsługa błędów
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

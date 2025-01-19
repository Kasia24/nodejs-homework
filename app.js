const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require("./routes/user");

dotenv.config(); // Ładowanie zmiennych środowiskowych z .env

const app = express();

// Połączenie z bazą danych
connectDB();

// Middleware do przetwarzania JSON w żądaniach
app.use(express.json());

// Trasy
app.use("/users", userRouter);

// Uruchomienie aplikacji
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

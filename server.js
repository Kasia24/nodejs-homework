const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const contactRoutes = require("./routes/contacts");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/contacts", contactRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

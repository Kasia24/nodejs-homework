const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const Contacts = require("./routes/api/contacts");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/contacts", Contacts);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

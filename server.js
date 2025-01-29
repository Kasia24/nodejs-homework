const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const contactsRouter = require("./routes/api/contacts");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/contacts", contactsRouter);

// Umożliwiamy dostęp do plików statycznych w folderze 'public'
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

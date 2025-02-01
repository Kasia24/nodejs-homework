const mongoose = require("mongoose");
const gravatar = require("gravatar");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    favorite: { type: Boolean, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
contactSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("email")) {
    const avatar = gravatar.url(this.email, {
      s: "200", // Rozmiar awatara
      r: "pg", // Jakość (pg = rysunki)
      d: "identicon", // Domyślny awatar (jeśli użytkownik nie ma Gravatar)
    });
    this.avatarURL = avatar;
  }
  next();
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;

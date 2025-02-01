const mongoose = require("mongoose");
const gravatar = require("gravatar");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    favorite: { type: Boolean, default: false },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(
          this.email,
          { s: "200", r: "pg", d: "identicon" },
          true
        );
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;

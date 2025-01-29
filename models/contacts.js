const mongoose = require("mongoose");

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

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;

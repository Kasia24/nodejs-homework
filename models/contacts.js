const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\(\d{3}\) \d{3}-\d{4}$/, "Please provide a valid phone number"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Automatyczne dodanie `createdAt` i `updatedAt`
);

// Dodanie metod i funkcji statycznych
contactSchema.methods.markAsFavorite = function () {
  this.favorite = true;
  return this.save();
};

contactSchema.statics.findFavorites = function () {
  return this.find({ favorite: true });
};

module.exports = mongoose.model("Contact", contactSchema);

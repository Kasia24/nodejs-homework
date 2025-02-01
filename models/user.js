const mongoose = require("mongoose");
const gravatar = require("gravatar");

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
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

const User = mongoose.model("User", userSchema);

module.exports = User;

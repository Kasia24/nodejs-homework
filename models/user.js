import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
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
});

// Hashowanie hasła przed zapisaniem
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("user", userSchema);

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  favorite: { type: Boolean, default: false },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Contact = mongoose.model("contact", contactSchema);

module.exports = { User, Contact };

// Add ADMIN role via Database Client tools.
export const UserRole = Object.freeze({
  ADMIN: "ADMIN",
  USER: "USER",
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [UserRole.ADMIN, UserRole.USER],
    default: UserRole.USER,
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
});

export const Users = mongoose.model("user", UserSchema);

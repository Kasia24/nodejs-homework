import mongoose, { Schema } from "mongoose";

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

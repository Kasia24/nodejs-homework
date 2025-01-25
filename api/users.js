import { Router } from "express";
import bcrypt from "bcrypt"; /* Checkout Argon2 */
import chalk from "chalk";
import { auth } from "../middlewares/auth.js";
import { User, UserRole } from "../models/user.js";
import { HttpError } from "../models/HttpError.js";
import { JWT } from "../lib/jwt.js";

export const usersRouter = Router();

const MONTH = 31 * 24 * 60 * 60 * 1_000; // Miliseconds.

const hashPassword = async (pwd) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pwd, salt);

  return hash;
};

const validatePassword = async (pwd, hash) => bcrypt.compare(pwd, hash);

// Data Transfer Object.
const toUserDto = (userEntity) => ({
  id: userEntity._id,
  email: userEntity.email,
  // role: userEntity.role,
});

// Get All Users.
usersRouter.get("/", auth([UserRole.ADMIN]), async (req, res) => {
  const users = await User.find();
  return res.json(users.map(toUserDto));
});

// Register.
usersRouter.post("/", async (req, res, next) => {
  const { email, password } = req.body;

  const userWithEmail = await Users.findOne({ email });
  if (userWithEmail) {
    // return res.status(409).json({ error: "Email already exists" });
    return next(new HttpError(409, "Email already exists"));
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ email, password: hashedPassword });

  console.log(chalk.green(`User registered: ${user.email}`));

  return res.sendStatus(201);
});

// Login.
usersRouter.post("/me", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // return res.status(401).json({ error: "Invalid credentials" });
    return next(new HttpError(401, "Invalid credentials"));
  }

  const isValidPassword = await validatePassword(password, user.password);

  if (!isValidPassword) {
    // return res.status(401).json({ error: "Invalid credentials" });
    return next(new HttpError(401, "Invalid credentials"));
  }

  const token = await JWT.sign({ id: user._id });
  res.cookie("authorization", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: MONTH,
    // signed: true,
    // secure: true,
  });

  console.log(chalk.green(`User logged in: ${user.email}`));

  return res.json({ token });
});

// Get Current user.
usersRouter.get("/me", auth(), async (req, res, next) => {
  const user = await User.findById(req?.userId);

  if (!user) {
    // return res.sendStatus(403);
    return next(new HttpError(403, "Unauthorized"));
  }

  return res.json(toUserDto(user));
});

// Logout.
usersRouter.delete("/me", auth(), async (req, res) => {
  const user = await User.findById(req?.userId);
  console.log(chalk.green(`User logged out: ${user.email}`));

  return res.sendStatus(204);
});

const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Funkcja do rejestracji użytkownika
async function signupUser(req, res) {
  const { email, password } = req.body;

  // Sprawdzenie, czy e-mail już istnieje
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email in use" });
  }

  // Hashowanie hasła
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tworzenie nowego użytkownika
  const newUser = new User({
    email,
    password: hashedPassword, // Zapisujemy zahaszowane hasło
  });

  try {
    // Zapisz użytkownika w bazie
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Zwróć dane użytkownika i token
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

// Funkcja logowania użytkownika
async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  // Porównanie hasła z bazy danych
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  user.token = token;
  await user.save();

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
}

module.exports = {
  signupUser,
  loginUser,
};

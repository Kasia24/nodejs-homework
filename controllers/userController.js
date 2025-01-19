const bcrypt = require("bcryptjs");
const User = require("..//models/user"); // Twój model użytkownika
const { generateToken } = require("..//middlewares/auth"); // Funkcja generująca JWT token

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
  const user = new User({
    email,
    password: hashedPassword,
    subscription: "starter", // domyślna subskrypcja
  });

  try {
    // Zapisz użytkownika w bazie
    await user.save();
    const token = generateToken(user._id);

    // Zwróć dane użytkownika i token
    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
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

  // Sprawdzenie, czy użytkownik istnieje
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  // Porównanie hasła z bazy danych
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  // Generowanie tokenu
  const token = generateToken(user._id);

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
}

// Eksport funkcji
module.exports = {
  signupUser,
  loginUser,
};

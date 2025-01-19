document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  // Importowanie axios
  const axios = require("axios");

  // Obsługa formularza rejestracji
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const signupMessage = document.getElementById("signup-message");
    signupMessage.textContent = ""; // Resetowanie komunikatu

    try {
      const response = await axios.post("http://localhost:5000/users/signup", {
        email,
        password,
      });

      if (response.status === 201) {
        signupMessage.textContent = "Rejestracja przebiegła pomyślnie!";
        signupMessage.classList.add("success-message");
      } else {
        signupMessage.textContent = response.data.message;
      }
    } catch (error) {
      signupMessage.textContent = "Wystąpił błąd. Spróbuj ponownie.";
    }
  });

  // Obsługa formularza logowania
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const loginMessage = document.getElementById("login-message");
    loginMessage.textContent = ""; // Resetowanie komunikatu

    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });

      if (response.status === 200) {
        loginMessage.textContent = "Zalogowano pomyślnie!";
        loginMessage.classList.add("success-message");
        // Możesz zapisać token w localStorage lub cookies
        localStorage.setItem("token", response.data.token);
      } else {
        loginMessage.textContent = response.data.message;
      }
    } catch (error) {
      loginMessage.textContent = "Wystąpił błąd. Spróbuj ponownie.";
    }
  });
});

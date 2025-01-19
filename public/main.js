document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  // Obsługa formularza rejestracji
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const signupMessage = document.getElementById("signup-message");
    signupMessage.textContent = ""; // Resetowanie komunikatu

    try {
      const response = await fetch("/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        signupMessage.textContent = "Rejestracja przebiegła pomyślnie!";
        signupMessage.classList.add("success-message");
      } else {
        signupMessage.textContent = result.message;
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
      const response = await fetch("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        loginMessage.textContent = "Zalogowano pomyślnie!";
        loginMessage.classList.add("success-message");
        // Możesz zapisać token w localStorage lub cookies
        localStorage.setItem("token", result.token);
      } else {
        loginMessage.textContent = result.message;
      }
    } catch (error) {
      loginMessage.textContent = "Wystąpił błąd. Spróbuj ponownie.";
    }
  });
});

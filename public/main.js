import { Api } from "./api.js";

const onSubmit = (callback) => async (event) => {
  event.preventDefault();
  const form = event.target;
  const email = form.elements["email"].value;
  const password = form.elements["password"].value;

  const body = { email, password };
  console.log(body);

  try {
    await callback(body);
  } catch (error) {
    console.error("Error during submit:", error);
    alert("An error occurred. Please try again.");
  }

  form.reset();
};

const updateStatus = async () => {
  try {
    const currentUser = await Api.getCurrentUser();
    document.querySelector("#status").textContent =
      currentUser === null
        ? "Please login"
        : `Logged in as ${currentUser.email}`;
  } catch (error) {
    console.error("Error fetching current user:", error);
    document.querySelector("#status").textContent = "Error fetching status";
  }
};

updateStatus().catch();

document
  .querySelector("form#register")
  .addEventListener("submit", onSubmit(Api.register));

document.querySelector("form#login").addEventListener(
  "submit",
  onSubmit((credentials) => Api.login(credentials).then(updateStatus))
);

document.querySelector("button#logout").addEventListener("click", () => {
  Api.logout()
    .then(updateStatus)
    .catch((error) => {
      console.error("Error during logout:", error);
      alert("An error occurred during logout.");
    });
});

document.querySelector("button#users").addEventListener("click", () => {
  Api.getAllUsers()
    .then((users) => {
      console.log(users);
      // Display users in HTML
      document.querySelector("#user-list").innerHTML = users
        .map((user) => `<li>${user.email}</li>`)
        .join("");
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      alert("An error occurred while fetching users.");
    });
});

document.querySelector("button#jwts").addEventListener("click", () =>
  Api.generateSomeJwt().then(({ token }) => {
    const parts = token.split(".");
    const decoded = parts.slice(0, 2).map((part) => atob(part));

    const jwt = { token, parts, decoded };
    console.log(jwt);
    alert(JSON.stringify(jwt, null, 2));
  })
);

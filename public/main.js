import { Api } from "./api.js";

const onSubmit =
  (callback = async (body) => {}) =>
  async (event) => {
    event.preventDefault();

    const form = event.target;

    const email = form.elements["email"].value;
    const password = form.elements["password"].value;

    const body = { email, password };

    console.log(body);
    await callback(body);

    form.reset();
  };

const updateStatus = async () => {
  const currentUser = await Api.getCurrentUser().catch(() => null);

  document.querySelector("#status").textContent =
    currentUser === null ? "Please login" : `Logged in as ${currentUser.email}`;
};

updateStatus().catch();

document
  .querySelector("form#register")
  .addEventListener("submit", onSubmit(Api.register));

document.querySelector("form#login").addEventListener(
  "submit",
  onSubmit((credentials) => Api.login(credentials).then(updateStatus))
);

document
  .querySelector("button#logout")
  .addEventListener("click", () => Api.logout().then(updateStatus));

document
  .querySelector("button#users")
  .addEventListener("click", () => Api.getAllUsers().then(console.log));

document.querySelector("button#jwts").addEventListener("click", () =>
  Api.generateSomeJwt().then(({ token }) => {
    const parts = token.split(".");
    const decoded = parts.slice(0, 2).map((part) => atob(part));
    const jwt = { token, parts, decoded };

    console.log(jwt);
    alert(JSON.stringify(jwt, null, 2));
  })
);

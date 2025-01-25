import { HttpClient } from "./http-client.js";

// const API_URL = `http://localhost:5000/api/v1`;

const Client = new HttpClient(`/api/v1`, {
  "Content-Type": "application/json",
});

/*
Saving JWT Token in LocalStorage only for demonstrational purposes.
It is insecure to do so in real world scenario.
We will use Cookies in the next examples.
*/

const LOCAL_STORAGE_KEY = "goit-auth-example";
const saveToken = (data) => {
  Client.setAuthHeader(data.token);
  localStorage.setItem(LOCAL_STORAGE_KEY, data.token);
  return data;
};

const clearToken = () => {
  Client.clearAuthHeader();
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

(() => {
  // No need to logging in again. User is remembered.
  const token = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (token) {
    Client.setAuthHeader(token);
  }
})();

export const Api = {
  register: async (credentials) => Client.post(`/users`, credentials),
  login: async (credentials) =>
    Client.post(`/users/me`, credentials).then(saveToken),

  // Logged in users.
  logout: async () => Client.delete(`/users/me`).then(clearToken),

  getCurrentUser: async () => Client.get(`/users/me`),
  getAllUsers: async () => Client.get(`/users`), // ADMIN role only.

  generateSomeJwt: async () => Client.get(`/jwts`),
};

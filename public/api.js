export const Api = {
  async register({ email, password }) {
    const response = await fetch("/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Registration failed");
    return await response.json();
  },

  async login({ email, password }) {
    const response = await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    return await response.json();
  },

  async logout() {
    // Wysłać request do serwera, żeby usunąć token
    const response = await fetch("/users/logout", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) throw new Error("Logout failed");
    return await response.json();
  },

  async getAllUsers() {
    const response = await fetch("/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to get users");
    return await response.json();
  },

  async generateSomeJwt() {
    const response = await fetch("/jwts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to generate JWT");
    return await response.json();
  },

  async getCurrentUser() {
    const response = await fetch("/users/current", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to get current user");
    return await response.json();
  },
};

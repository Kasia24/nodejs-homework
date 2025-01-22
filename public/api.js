const axios = require("axios");

export const Api = {
  // Pomocnicza funkcja do pobrania tokenu
  getAuthToken() {
    if (typeof window !== "undefined" && window.localStorage) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Brak tokenu autoryzacji. Zaloguj się ponownie.");
      }
      return token;
    }
    throw new Error("localStorage is not available");
  },

  // Wspólna funkcja do obsługi zapytań
  async makeRequest(url, method, data = null) {
    const token = this.getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios({
        url,
        method,
        data,
        headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Wystąpił błąd");
    }
  },

  // Rejestracja nowego użytkownika
  async register({ email, password }) {
    return this.makeRequest("/users/signup", "POST", { email, password });
  },

  // Logowanie użytkownika
  async login({ email, password }) {
    return this.makeRequest("/users/login", "POST", { email, password });
  },

  // Wylogowanie użytkownika
  async logout() {
    return this.makeRequest("/users/logout", "POST");
  },

  // Pobierz wszystkie kontakty
  async getContacts({ page = 1, limit = 20, favorite }) {
    const url = new URL("/api/contacts", window.location.href);
    const params = { page, limit, favorite };
    Object.keys(params).forEach(
      (key) =>
        params[key] !== undefined && url.searchParams.append(key, params[key])
    );
    return this.makeRequest(url.href, "GET");
  },

  // Pobierz pojedynczy kontakt po ID
  async getContactById(contactId) {
    return this.makeRequest(`/api/contacts/${contactId}`, "GET");
  },

  // Dodaj nowy kontakt
  async addContact({ name, email, phone, favorite }) {
    return this.makeRequest("/api/contacts", "POST", {
      name,
      email,
      phone,
      favorite,
    });
  },

  // Zaktualizuj kontakt
  async updateContact({ contactId, name, email, phone, favorite }) {
    return this.makeRequest(`/api/contacts/${contactId}`, "PUT", {
      name,
      email,
      phone,
      favorite,
    });
  },

  // Zaktualizuj status ulubionego kontaktu
  async updateFavorite(contactId, favorite) {
    return this.makeRequest(`/api/contacts/${contactId}/favorite`, "PATCH", {
      favorite,
    });
  },

  // Usuń kontakt
  async deleteContact(contactId) {
    return this.makeRequest(`/api/contacts/${contactId}`, "DELETE");
  },

  // Pobierz aktualnego użytkownika
  async getCurrentUser() {
    return this.makeRequest("/users/current", "GET");
  },

  // Wygeneruj JWT dla aktualnego użytkownika (opcjonalne)
  async generateJwt() {
    return this.makeRequest("/users/jwts", "GET");
  },
};

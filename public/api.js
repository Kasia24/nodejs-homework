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

  // Rejestracja nowego użytkownika
  async register({ email, password }) {
    try {
      const response = await axios.post("/users/signup", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error("Rejestracja nie powiodła się");
    }
  },

  // Logowanie użytkownika
  async login({ email, password }) {
    try {
      const response = await axios.post("/users/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error("Logowanie nie powiodło się");
    }
  },

  // Wylogowanie użytkownika
  async logout() {
    const token = this.getAuthToken();
    try {
      const response = await axios.post(
        "/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Wylogowanie nie powiodło się");
    }
  },

  // Pobierz wszystkie kontakty
  async getContacts({ page = 1, limit = 20, favorite }) {
    const token = this.getAuthToken();
    const url = new URL("/api/contacts", window.location.href);
    const params = { page, limit, favorite };
    Object.keys(params).forEach(
      (key) =>
        params[key] !== undefined && url.searchParams.append(key, params[key])
    );

    try {
      const response = await axios.get(url.href, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Nie udało się pobrać kontaktów");
    }
  },

  // Pobierz pojedynczy kontakt po ID
  async getContactById(contactId) {
    const token = this.getAuthToken();
    try {
      const response = await axios.get(`/api/contacts/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Nie udało się pobrać kontaktu");
    }
  },

  // Dodaj nowy kontakt
  async addContact({ name, email, phone, favorite }) {
    const token = this.getAuthToken();
    try {
      const response = await axios.post(
        "/api/contacts",
        {
          name,
          email,
          phone,
          favorite,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Dodawanie kontaktu nie powiodło się");
    }
  },

  // Zaktualizuj kontakt
  async updateContact({ contactId, name, email, phone, favorite }) {
    const token = this.getAuthToken();
    try {
      const response = await axios.put(
        `/api/contacts/${contactId}`,
        {
          name,
          email,
          phone,
          favorite,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Aktualizacja kontaktu nie powiodła się");
    }
  },

  // Zaktualizuj status ulubionego kontaktu
  async updateFavorite(contactId, favorite) {
    const token = this.getAuthToken();
    try {
      const response = await axios.patch(
        `/api/contacts/${contactId}/favorite`,
        {
          favorite,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        "Aktualizacja statusu ulubionego kontaktu nie powiodła się"
      );
    }
  },

  // Usuń kontakt
  async deleteContact(contactId) {
    const token = this.getAuthToken();
    try {
      const response = await axios.delete(`/api/contacts/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Usuwanie kontaktu nie powiodło się");
    }
  },

  // Pobierz aktualnego użytkownika
  async getCurrentUser() {
    const token = this.getAuthToken();
    try {
      const response = await axios.get("/users/current", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Nie udało się pobrać danych użytkownika");
    }
  },

  // Wygeneruj JWT dla aktualnego użytkownika (opcjonalne)
  async generateJwt() {
    const token = this.getAuthToken();
    try {
      const response = await axios.get("/users/jwts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Nie udało się wygenerować JWT");
    }
  },
};

export const Api = {
  // Rejestracja nowego użytkownika
  async register({ email, password }) {
    const response = await fetch("/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Rejestracja nie powiodła się");
    return await response.json();
  },

  // Logowanie użytkownika
  async login({ email, password }) {
    const response = await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Logowanie nie powiodło się");
    return await response.json();
  },

  // Wylogowanie użytkownika
  async logout() {
    const response = await fetch("/users/logout", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) throw new Error("Wylogowanie nie powiodło się");
    return await response.json();
  },

  // Pobierz wszystkie kontakty
  async getContacts({ page = 1, limit = 20, favorite }) {
    const url = new URL("/api/contacts", window.location.href);
    const params = { page, limit, favorite };
    Object.keys(params).forEach(
      (key) =>
        params[key] !== undefined && url.searchParams.append(key, params[key])
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) throw new Error("Nie udało się pobrać kontaktów");
    return await response.json();
  },

  // Pobierz pojedynczy kontakt po ID
  async getContactById(contactId) {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) throw new Error("Nie udało się pobrać kontaktu");
    return await response.json();
  },

  // Dodaj nowy kontakt
  async addContact({ name, email, phone, favorite }) {
    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ name, email, phone, favorite }),
    });
    if (!response.ok) throw new Error("Dodawanie kontaktu nie powiodło się");
    return await response.json();
  },

  // Zaktualizuj kontakt
  async updateContact({ contactId, name, email, phone, favorite }) {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ name, email, phone, favorite }),
    });
    if (!response.ok) throw new Error("Aktualizacja kontaktu nie powiodła się");
    return await response.json();
  },

  // Zaktualizuj status ulubionego kontaktu
  async updateFavorite(contactId, favorite) {
    const response = await fetch(`/api/contacts/${contactId}/favorite`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ favorite }),
    });
    if (!response.ok)
      throw new Error(
        "Aktualizacja statusu ulubionego kontaktu nie powiodła się"
      );
    return await response.json();
  },

  // Usuń kontakt
  async deleteContact(contactId) {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) throw new Error("Usuwanie kontaktu nie powiodło się");
    return response.json();
  },

  // Pobierz aktualnego użytkownika
  async getCurrentUser() {
    const response = await fetch("/users/current", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok)
      throw new Error("Nie udało się pobrać danych użytkownika");
    return await response.json();
  },

  // Wygeneruj JWT dla aktualnego użytkownika (opcjonalne)
  async generateJwt() {
    const response = await fetch("/jwts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) throw new Error("Nie udało się wygenerować JWT");
    return await response.json();
  },
};

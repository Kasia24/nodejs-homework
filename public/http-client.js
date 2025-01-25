export class HttpClient {
  constructor(baseUrl, defaultHeaders = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
  }

  setAuthHeader(token) {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  clearAuthHeader() {
    this.defaultHeaders.Authorization = "";
  }

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, body) {
    return this.request(endpoint, "POST", body);
  }

  async patch(endpoint, body) {
    return this.request(endpoint, "PATCH", body);
  }

  async delete(endpoint) {
    return this.request(endpoint, "DELETE");
  }

  async request(endpoint, method, body) {
    const url = `${this.baseUrl}${endpoint}`;
    return fetch(url, {
      method,
      headers: this.defaultHeaders,
      body: JSON.stringify(body),
    })
      .then((response) =>
        response.headers.get("Content-Type")?.includes("application/json")
          ? response.json()
          : response.text()
      )
      .catch(console.error);
  }
}

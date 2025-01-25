import chalk from "chalk";

class Config {
  #_PORT;
  #_MONGODB_URI;
  #_JWT_SECRET;
  #_COOKIE_SECRET;

  constructor() {
    this.#_PORT = this.#normalizePort(this.#getEnv("PORT", "3001"));
    this.#_MONGODB_URI = this.#getEnv("MONGODB_URI");
    this.#_JWT_SECRET = this.#getEnv("JWT_SECRET");
    this.#_COOKIE_SECRET = this.#getEnv("COOKIE_SECRET");

    console.log(chalk.magenta("Config loaded."));
  }

  get PORT() {
    return this.#_PORT;
  }

  get MONGODB_URI() {
    return this.#_MONGODB_URI;
  }

  get JWT_SECRET() {
    return this.#_JWT_SECRET;
  }

  get COOKIE_SECRET() {
    return this.#_COOKIE_SECRET;
  }

  #getEnv(name, defaultValue) {
    const value = process.env[name];

    if (!value) {
      if (defaultValue) return defaultValue;
      throw new Error(`Environment variable ${name} is not set.`);
    }

    return value;
  }

  #normalizePort(port) {
    const parsedPort = parseInt(port, 10);

    if (isNaN(parsedPort)) {
      throw new Error(`Invalid port of "${port}"`);
    }

    const minPort = 0;
    const maxPort = 65_535;

    if (parsedPort < minPort || parsedPort > maxPort) {
      throw new Error(`Port "${parsedPort}" out of range.`);
    }

    return parsedPort;
  }
}

export const config = new Config();

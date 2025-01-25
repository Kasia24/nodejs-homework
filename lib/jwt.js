import jwt from "jsonwebtoken";
import { config } from "../Config.js";

const { JWT_SECRET } = config;
const MONTH = 31 * 24 * 60 * 60; // seconds

// https://www.npmjs.com/package/jsonwebtoken
export class JWT {
  static async sign(data) {
    const iat = Math.floor(Date.now() / 1000);

    const payload = { iat, data };

    const options = { expiresIn: MONTH };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, JWT_SECRET, options, (error, token) =>
        error
          ? reject(error)
          : token
          ? resolve(token)
          : reject(new Error("Undefined token."))
      );
    });
  }

  static async verify(token) {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SECRET, (error) =>
        error ? resolve(false) : resolve(true)
      );
    });
  }

  static decode(token) {
    return jwt.decode(token);
  }
}

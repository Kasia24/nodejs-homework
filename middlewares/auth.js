import { JWT } from "../lib/jwt.js";
import { User, UserRole } from "../models/user.js";
import { HttpError } from "../models/HttpError.js";

export const auth =
  (roles = [UserRole.USER, UserRole.ADMIN]) =>
  async (req, res, next) => {
    /* Auth Header */
    // const authtoken = req.headers["authorization"];
    /* Auth Cookie */
    const authtoken = req.cookies["authorization"];

    const token = authtoken?.replace("Bearer ", "");

    const isTokenValid = await JWT.verify(token);
    if (!isTokenValid) {
      // return res.status(401).json({ error: "Invalid token." });
      return next(new HttpError(401, "Invalid token."));
    }

    const tokenData = JWT.decode(token);
    if (!tokenData?.data) {
      // return res.status(401).json({ error: "Malformed token." });
      return next(new HttpError(401, "Malformed token."));
    }

    const user = await User.findById(tokenData?.data?.id);

    if (!user || !roles.includes(user?.role)) {
      // return res.status(403).json({ error: "Unauthorized." });
      return next(new HttpError(403, "Unauthorized."));
    }

    req.userId = user._id;

    next();
  };

import { getUserById } from "#db/queries/users";
import { verifyToken } from "#utils/jwt";

/** Attaches the user to the request if a valid token is provided */
export default async function getUserFromToken(req, res, next) {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) return next();

  const token = authorization.split(" ")[1];
  try {
    const { id } = verifyToken(token);
    const user = await getUserById(id);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send("Invalid token.");
  }
}
/**
 * Middleware that checks for a JWT in the Authorization header.
 * If a valid token is provided, the corresponding user is attached
 * to req.user. If no token is provided, the request continues as a guest.
 *
 * This allows routes to decide how to handle authenticated vs
 * unauthenticated users.
 */

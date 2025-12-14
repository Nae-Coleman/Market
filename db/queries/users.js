import db from "#db/client";
import bcrypt from "bcrypt";

/**
 * Create a new user
 * - hashes the password before storing
 * - returns the new user's id and username
 */
export async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const {
    rows: [user],
  } = await db.query(
    `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username;
    `,
    [username, hashedPassword]
  );

  return user;
}

/**
 * Get a user by username
 * - used during login
 * - returns the full user record (including hashed password)
 */
export async function getUserByUsername(username) {
  const {
    rows: [user],
  } = await db.query(
    `
    SELECT *
    FROM users
    WHERE username = $1;
    `,
    [username]
  );

  return user;
}

/**
 * Get a user by id
 * - used by authentication middleware
 * - does NOT return the password
 */
export async function getUserById(id) {
  const {
    rows: [user],
  } = await db.query(
    `
    SELECT id, username
    FROM users
    WHERE id = $1;
    `,
    [id]
  );

  return user;
}

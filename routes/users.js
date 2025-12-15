import express from "express";
import bcrypt from "bcrypt";

import { createUser, getUserByUsername } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";

const router = express.Router();

/**
 * POST /users/register
 * - creates a new user
 * - returns a JWT token
 */
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await createUser(username, password);
      const token = createToken({ id: user.id });

      res.status(201).send({ token });
    } catch (err) {
      res.status(400).send("Username already exists");
    }
  }
);

/**
 * POST /users/login
 * - verifies credentials
 * - returns a JWT token
 */
router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;

    const user = await getUserByUsername(username);
    if (!user) return res.status(401).send("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send("Invalid credentials");

    const token = createToken({ id: user.id });
    res.send({ token });
  }
);

export default router;

/**
 * Users Router
 *
 * Handles user registration and login.
 * Passwords are hashed before being stored.
 * Successful authentication returns a JWT token.
 */
// Register a new user
// - Validates required fields
// - Hashes password before saving
// - Returns a token for immediate authentication
// Login existing user
// - Compares hashed passwords
// - Returns a token if credentials are valid

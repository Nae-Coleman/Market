import express from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  addProductToOrder,
  getProductsForOrder,
} from "#db/queries/orders";

import { getProductById } from "#db/queries/products";

const router = express.Router();

/**
 *  POST /orders
 */
router.post("/", async (req, res) => {
  // 1️ Missing date → 400
  if (!req.body || !req.body.date) {
    return res.status(400).send("Missing required fields");
  }

  // 2️ Not logged in → 401
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  // 3️ Create order
  const order = await createOrder(req.body.date, req.body.note, req.user.id);

  // 4️ Success
  res.status(201).send(order);
});

/**
 *  GET /orders
 */
router.get("/", async (req, res) => {
  // 1️ Not logged in → 401
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  // 2️ Get orders
  const orders = await getOrdersByUser(req.user.id);

  // 3️ Success
  res.send(orders);
});

/**
 *  GET /orders/:id
 */
router.get("/:id", async (req, res) => {
  // 1️ Order must exist → 404
  const order = await getOrderById(req.params.id);
  if (!order) {
    return res.status(404).send("Order not found");
  }

  // 2️ User must be logged in → 401
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  // 3️ User must own the order → 403
  if (order.user_id !== req.user.id) {
    return res.status(403).send("Forbidden");
  }

  // 4️ Success
  res.send(order);
});

/**
 *  POST /orders/:id/products
 */
router.post("/:id/products", async (req, res) => {
  // 1️ Order must exist → 404
  const order = await getOrderById(req.params.id);
  if (!order) {
    return res.status(404).send("Order not found");
  }

  // 2️ User must be logged in → 401
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  // 3️ User must own the order → 403
  if (order.user_id !== req.user.id) {
    return res.status(403).send("Forbidden");
  }

  // 4️ Missing required fields → 400
  if (!req.body?.productId || !req.body?.quantity) {
    return res.status(400).send("Missing required fields");
  }

  // 5️ Product must exist → 400
  const product = await getProductById(req.body.productId);
  if (!product) {
    return res.status(400).send("Invalid product");
  }

  // 6️ Add product to order
  const record = await addProductToOrder(
    order.id,
    product.id,
    req.body.quantity
  );

  // 7️ Success
  res.status(201).send(record);
});

/**
 *  GET /orders/:id/products
 */
router.get("/:id/products", async (req, res) => {
  // 1️ Order must exist → 404
  const order = await getOrderById(req.params.id);
  if (!order) {
    return res.status(404).send("Order not found");
  }

  // 2️ User must be logged in → 401
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  // 3️ User must own the order → 403
  if (order.user_id !== req.user.id) {
    return res.status(403).send("Forbidden");
  }

  // 4️ Success
  const products = await getProductsForOrder(order.id);
  res.send(products);
});

export default router;

/**
 * Orders Router
 *
 * Handles order creation and retrieval.
 * All order routes are protected and require authentication.
 * Ownership checks ensure users can only access their own orders.
 */
//post/order
// Creates a new order for the logged-in user
// Request body is validated before authentication checks
// This ensures correct HTTP status codes are returned
//get/orders
//// Returns all orders belonging to the logged-in user
//get/orders/:id
//// Retrieves a specific order
// Order existence is checked first
// Then authentication and ownership are verified
//POST /orders/:id/products
//// Adds a product to an existing order
// Validation order:
// 1. Order existence
// 2. Authentication
// 3. Ownership
// 4. Request body validation
// 5. Product existence
//GET /orders/:id/products
//// Returns all products associated with an order
// Only the owner of the order may access this data

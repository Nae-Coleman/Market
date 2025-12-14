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
 * 🔒 POST /orders
 */
router.post("/", requireUser, requireBody(["date"]), async (req, res) => {
  const order = await createOrder(req.body.date, req.body.note, req.user.id);
  res.status(201).send(order);
});

/**
 * 🔒 GET /orders
 */
router.get("/", requireUser, async (req, res) => {
  const orders = await getOrdersByUser(req.user.id);
  res.send(orders);
});

/**
 * 🔒 GET /orders/:id
 */
router.get("/:id", requireUser, async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.status(404).send("Order not found");
  if (order.user_id !== req.user.id) return res.status(403).send("Forbidden");

  res.send(order);
});

/**
 * 🔒 POST /orders/:id/products
 */
router.post(
  "/:id/products",
  requireUser,
  requireBody(["productId", "quantity"]),
  async (req, res) => {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found");
    if (order.user_id !== req.user.id) return res.status(403).send("Forbidden");

    const product = await getProductById(req.body.productId);
    if (!product) return res.status(400).send("Invalid product");

    const record = await addProductToOrder(
      order.id,
      product.id,
      req.body.quantity
    );

    res.status(201).send(record);
  }
);

/**
 *  GET /orders/:id/products
 */
router.get("/:id/products", requireUser, async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.status(404).send("Order not found");
  if (order.user_id !== req.user.id) return res.status(403).send("Forbidden");

  const products = await getProductsForOrder(order.id);
  res.send(products);
});

export default router;

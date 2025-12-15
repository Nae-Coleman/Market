import express from "express";
import requireUser from "#middleware/requireUser";

import {
  getAllProducts,
  getProductById,
  getOrdersForProductByUser,
} from "#db/queries/products";

const router = express.Router();

/**
 * GET /products
 * - public
 * - returns all products
 */
router.get("/", async (req, res) => {
  const products = await getAllProducts();
  res.send(products);
});

/**
 * GET /products/:id
 * - public
 * - returns a single product
 */
router.get("/:ids", async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.send(product);
});

/**
 *  GET /products/:id/orders
 * - returns orders made by the logged-in user
 *   that include this product
 */
router.get("/:id/orders", requireUser, async (req, res) => {
  const product = await getProductById(Number(req.params.id));
  if (!product) return res.status(404).send("Product not found");

  const orders = await getOrdersForProductByUser(product.id, req.user.id);

  res.send(orders);
});

export default router;
/**
 * Products Router
 *
 * Public routes for browsing products.
 * No authentication is required to view products.
 */
//G ET /products/:id Retrieves a single product by id
// Returns 404 if the product does not exist
//GET /products/:id/orders
//// Protected route
// Returns all orders made by the logged-in user that include this product
// Product existence is checked before authentication to return correct status codes

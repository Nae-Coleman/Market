import db from "#db/client";

/**
 * Get all products
 * - used by GET /products
 * - public route
 */
export async function getAllProducts() {
  const { rows } = await db.query(`
    SELECT *
    FROM products;
  `);

  return rows;
}

/**
 * Get a single product by id
 * - used by GET /products/:id
 */
export async function getProductById(id) {
  const {
    rows: [product],
  } = await db.query(
    `
    SELECT *
    FROM products
    WHERE id = $1;
    `,
    [id]
  );

  return product;
}

/**
 * Get all orders for a specific product
 * made by a specific user
 * - used by GET /products/:id/orders
 * - requires authentication
 */
export async function getOrdersForProductByUser(productId, userId) {
  const { rows } = await db.query(
    `
    SELECT orders.*
    FROM orders
    JOIN orders_products
      ON orders.id = orders_products.order_id
    WHERE orders_products.product_id = $1
      AND orders.user_id = $2;
    `,
    [productId, userId]
  );

  return rows;
}

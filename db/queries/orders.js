import db from "#db/client";

/**
 * Create a new order
 * - associates the order with a user
 */
export async function createOrder(date, note, userId) {
  const {
    rows: [order],
  } = await db.query(
    `
    INSERT INTO orders (date, note, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [date, note, userId]
  );

  return order;
}

/**
 * Get all orders for a specific user
 * - used by GET /orders
 */
export async function getOrdersByUser(userId) {
  const { rows } = await db.query(
    `
    SELECT *
    FROM orders
    WHERE user_id = $1;
    `,
    [userId]
  );

  return rows;
}

/**
 * Get a single order by id
 * - used by GET /orders/:id
 */
export async function getOrderById(id) {
  const {
    rows: [order],
  } = await db.query(
    `
    SELECT *
    FROM orders
    WHERE id = $1;
    `,
    [id]
  );

  return order;
}

/**
 * Add a product to an order
 * - inserts into the join table
 */
export async function addProductToOrder(orderId, productId, quantity) {
  const {
    rows: [record],
  } = await db.query(
    `
    INSERT INTO orders_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [orderId, productId, quantity]
  );

  return record;
}

/**
 * Get all products for a specific order
 * - includes quantity from the join table
 */
export async function getProductsForOrder(orderId) {
  const { rows } = await db.query(
    `
    SELECT products.*, orders_products.quantity
    FROM products
    JOIN orders_products
      ON products.id = orders_products.product_id
    WHERE orders_products.order_id = $1;
    `,
    [orderId]
  );

  return rows;
}

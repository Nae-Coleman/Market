-- TODO
-- Drop tables in reverse dependency order to avoid foreign key errors
-- orders_products depends on orders and products
-- orders depends on users
DROP TABLE IF EXISTS orders_products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- =========================
-- USERS TABLE
-- =========================
-- Stores registered users
-- Each user has a unique username and a hashed password
CREATE TABLE users (
  id SERIAL PRIMARY KEY,              -- Auto-incrementing user ID
  username TEXT NOT NULL UNIQUE,       -- Username must be unique
  password TEXT NOT NULL               -- Stores hashed password (bcrypt)
);

-- =========================
-- PRODUCTS TABLE
-- =========================
-- Stores all products available in the market
CREATE TABLE products (
  id SERIAL PRIMARY KEY,               -- Auto-incrementing product ID
  title TEXT NOT NULL,                 -- Product name/title
  description TEXT NOT NULL,           -- Product description
  price DECIMAL NOT NULL               -- Product price
);

-- =========================
-- ORDERS TABLE
-- =========================
-- Each order belongs to exactly one user
-- A user can have many orders (one-to-many)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,               -- Auto-incrementing order ID
  date DATE NOT NULL,                  -- Date the order was created
  note TEXT,                           -- Optional note for the order
  user_id INTEGER NOT NULL             -- References the user who made the order
    REFERENCES users(id)
    ON DELETE CASCADE                  -- Delete orders if the user is deleted
);

-- =========================
-- ORDERS_PRODUCTS TABLE
-- =========================
-- Join table to represent many-to-many relationship
-- between orders and products
-- Includes quantity of each product in an order
CREATE TABLE orders_products (
  order_id INTEGER NOT NULL            -- References an order
    REFERENCES orders(id)
    ON DELETE CASCADE,

  product_id INTEGER NOT NULL           -- References a product
    REFERENCES products(id)
    ON DELETE CASCADE,

  quantity INTEGER NOT NULL,            -- Quantity of the product in the order

  -- Composite primary key prevents duplicate products in the same order
  PRIMARY KEY (order_id, product_id)
);


--Users place orders. Orders belong to one user.
--Products are sold in many orders, and orders can contain many products,
--so I used a join table called orders_products to track quantities

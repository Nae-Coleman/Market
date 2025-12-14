import db from "#db/client";
import bcrypt from "bcrypt";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const {
    rows: [user],
  } = await db.query(
    `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING *;
    `,
    ["testuser", hashedPassword]
  );

  console.log("👤 User created:", user);

  const products = [
    { title: "Apples", description: "Fresh apples", price: 1.99 },
    { title: "Bananas", description: "Yellow bananas", price: 0.99 },
    { title: "Oranges", description: "Juicy oranges", price: 2.49 },
    { title: "Milk", description: "1 gallon of milk", price: 3.49 },
    { title: "Bread", description: "Whole wheat bread", price: 2.99 },
    { title: "Eggs", description: "Dozen eggs", price: 4.29 },
    { title: "Cheese", description: "Cheddar cheese", price: 5.99 },
    { title: "Chicken", description: "Chicken breast", price: 7.99 },
    { title: "Rice", description: "White rice", price: 2.19 },
    { title: "Pasta", description: "Penne pasta", price: 1.79 },
  ];

  const createdProducts = [];

  for (const product of products) {
    const {
      rows: [createdProduct],
    } = await db.query(
      `
      INSERT INTO products (title, description, price)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [product.title, product.description, product.price]
    );

    createdProducts.push(createdProduct);
  }

  console.log("🛍️ Products created:", createdProducts.length);

  const {
    rows: [order],
  } = await db.query(
    `
    INSERT INTO orders (date, note, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    ["2025-12-14", "Seeded order", user.id]
  );

  console.log("📦 Order created:", order);

  const orderProductPromises = createdProducts
    .slice(0, 5)
    .map((product, index) => {
      return db.query(
        `
      INSERT INTO orders_products (order_id, product_id, quantity)
      VALUES ($1, $2, $3);
      `,
        [order.id, product.id, index + 1]
      );
    });

  await Promise.all(orderProductPromises);

  console.log("🔗 Products added to order");
}

// TODO

//We hash "password123" so it’s secure
//We insert the user
// RETURNING * gives us the created user back
// We store it in user so we can use user.id later
//The seed script creates test users, products, and orders in the correct
// order to satisfy database relationships and allow backend testing
//slice(0, 5) → only use 5 products (assignment requirement)
// map() → turns each product into a database insert promise
// Promise.all() → waits until all inserts finis
// quantity → comes from the index (index + 1)

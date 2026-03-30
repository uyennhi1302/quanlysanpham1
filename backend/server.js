require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: "postgres",
  password: "postgres",
  database: "mydb",
  port: 5432,
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// About
app.get("/about", (req, res) => {
  res.send(`
    <h1>${process.env.APP_NAME}</h1>
    <p>Họ tên: Nguyen Thi Uyen Nhi</p>
    <p>MSSV: 2251220245</p>
    <p>Lớp:22CT2</p>
  `);
});

// GET products
app.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
});

// POST product
app.post("/products", async (req, res) => {
  const { name, price } = req.body;
  await pool.query(
    "INSERT INTO products(name, price) VALUES($1,$2)",
    [name, price]
  );
  res.send("Added");
});

app.listen(process.env.PORT, () => {
  console.log("Server running...");
});
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
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>About - ${process.env.APP_NAME}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .about-card {
          background: white;
          border-radius: 15px;
          padding: 30px 40px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          text-align: center;
          max-width: 400px;
        }
        h1 {
          margin-bottom: 20px;
          color: #333;
        }
        p {
          margin: 8px 0;
          font-size: 16px;
          color: #555;
        }
        .back-btn {
          margin-top: 20px;
          display: inline-block;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 8px;
          background-color: #28a745;
          color: white;
          font-weight: bold;
        }
        .back-btn:hover {
          background-color: #218838;
        }
      </style>
    </head>
    <body>
      <div class="about-card">
        <h1>${process.env.APP_NAME}</h1>
        <p><strong>Họ tên:</strong> Nguyen Thi Uyen Nhi</p>
        <p><strong>MSSV:</strong> 2251220245</p>
        <p><strong>Lớp:</strong> 22CT2</p>
        <a href="/" class="back-btn">Trang chủ</a>
      </div>
    </body>
    </html>
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

import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config(); // Load .env

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
let db;

// ==================== AUTH MIDDLEWARE ====================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// ==================== ROUTES ====================
// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const hashedPassword = await bcrypt.hash(password, 14);

    await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // max 10 attempts per IP
  message: "Too many login attempts. Try again later.",
});
app.post("/api/auth/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Current user
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, name, email FROM users WHERE id = ?", [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==================== SERVER INIT ====================
async function startServer() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("MySQL connected");

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  } catch (err) {
    console.error("Failed to connect to MySQL:", err);
    process.exit(1);
  }
}

startServer();

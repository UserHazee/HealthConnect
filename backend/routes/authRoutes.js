// routes/authRoutes.js
import express from "express";
import { login, register } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getDB } from "../config/db.js";

const router = express.Router();

// Registration route
router.post("/register", register);
// Add this to authRoutes.js
router.get("/token-debug", authenticateToken, async (req, res) => {
  res.json({
    req_user: req.user,
    req_user_id: req.user.id,
  });
});
// Login route
router.post("/login", login);

// Current user route
router.get("/me", authenticateToken, async (req, res) => {
  try {
    console.log("🔍 req.user in /me route:", req.user);
    
    if (!req.user) {
      console.error("❌ req.user is undefined");
      return res.status(401).json({ error: "User not authenticated" });
    }
    
    if (!req.user.id) {
      console.error("❌ req.user.id is undefined:", req.user);
      return res.status(401).json({ error: "Invalid user data" });
    }
    
    const db = getDB();
    console.log("🔍 Searching for user with uid:", req.user.id);
    
    const [rows] = await db.execute(
      "SELECT uid As id, first_name, last_name, email FROM UID WHERE uid = ?",
      [req.user.id]
    );

    console.log("📊 Database query result:", rows);

    if (rows.length === 0) {
      console.log("❌ No user found with uid:", req.user.id);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ User found:", rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
// routes/authRoutes.js
import express from "express";
import { login } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getDB } from "../config/db.js";

const router = express.Router();

// Login route
router.post("/login", login);

// Current user route
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

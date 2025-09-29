import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📩 Login attempt:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const db = getDB();
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE LOWER(email) = LOWER(?)",
      [email]
    );

    if (rows.length === 0) {
      console.log("❌ No account found for:", email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    console.log("✅ Found account:", user.email);
    console.log("🔍 User UID:", user.uid);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Ensure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not found in environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Token payload
    const tokenPayload = { id: user.uid, email: user.email };
    console.log("🎫 Token payload:", tokenPayload);

    // Generate token
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Token generated successfully");

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.uid,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// REGISTER FUNCTION
export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const db = getDB();

        // 1. Check if email already exists
        const [existingUser] = await db.execute("SELECT email FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // 2. Generate UUID for user
        const uid = uuidv4();
        console.log("🆔 Generated UID:", uid);

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4. Insert new user
        const sql = `
            INSERT INTO users (uid, first_name, last_name, email, password)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.execute(sql, [uid, first_name, last_name, email, hashedPassword]);

        console.log("✅ User registered successfully with UID:", uid);

        // 5. Respond to the frontend
        res.status(201).json({ message: "Registration successful" });

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
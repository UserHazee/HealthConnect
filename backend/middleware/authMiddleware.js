// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("🔍 Auth header:", authHeader);
  
  console.log("🎫 Token:", token);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ JWT verification error:", err);
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    console.log("✅ Decoded token:", decoded);

    // Check if decoded has the expected structure
    if (!decoded.id) {
      console.error("❌ No 'id' field in decoded token:", decoded);
      return res.status(403).json({ error: "Invalid token structure" });
    }

    // Always attach as req.user with id (mapped from uid in DB)
    req.user = { id: decoded.id, email: decoded.email };
    console.log("👤 Set req.user:", req.user);
    next();
  });
 
}
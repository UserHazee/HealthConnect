import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";  // <-- use your config

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// ✅ No more "let db" and middleware attaching req.db

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

async function startServer() {
  try {
    // ✅ Just call connectDB once
    await connectDB();

    const port = process.env.PORT || 5000;
    app.listen(port, () =>
      console.log(`🚀 Server running on http://localhost:${port}`)
    );
  } catch (err) {
    console.error("❌ Failed to connect to MySQL:", err);
    process.exit(1);
  }
}

startServer();

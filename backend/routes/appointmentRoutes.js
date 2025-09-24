import express from "express";
import {
  bookAppointment,
  getAppointments,
  cancelAppointment,
} from "../controllers/appointmentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All appointment routes require authentication
router.post("/", authenticateToken, bookAppointment);
router.get("/", authenticateToken, getAppointments);
router.delete("/:id", authenticateToken, cancelAppointment);

export default router;

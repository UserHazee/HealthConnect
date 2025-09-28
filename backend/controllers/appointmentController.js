// controllers/appointmentController.js
import { getDB } from "../config/db.js";

// Get all appointments for logged-in user
export async function getAppointments(req, res) {
  try {
    console.log("🔍 getAppointments called for user:", req.user.id);

    const db = getDB();

    // Check user distribution in appointments
    const [userDistribution] = await db.execute(`
      SELECT user_id, COUNT(*) as appointment_count 
      FROM appointments 
      GROUP BY user_id
    `);
    console.log("📊 Appointments per user:", userDistribution);

    // Then run the normal query
    const [rows] = await db.execute(
      `SELECT id, department, doctor, appointment_date, appointment_time, created_at 
       FROM appointments 
       WHERE user_id = ? 
       ORDER BY appointment_date ASC, appointment_time ASC`,
      [req.user.id]
    );

    console.log("📊 Found appointments for current user:", rows.length);
    res.json(rows);
  } catch (err) {
    console.error("Fetch appointments error:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
}

// POST /api/appointments - Create new appointment
export const bookAppointment = async (req, res) => {
  try {
    const { department, doctor, appointment_date, appointment_time } = req.body;

    console.log("📝 Booking appointment:", { department, doctor, appointment_date, appointment_time });
    console.log("👤 User ID:", req.user.id);

    if (!department || !doctor || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const db = getDB();

    const [result] = await db.execute(
      `INSERT INTO appointments 
       (user_id, department, doctor, appointment_date, appointment_time) 
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, department, doctor, appointment_date, appointment_time]
    );

    const newAppointment = {
      id: result.insertId,
      user_id: req.user.id,
      department,
      doctor,
      appointment_date,
      appointment_time
    };

    console.log("✅ Appointment created:", newAppointment);
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/appointments/:id - Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const db = getDB();

    console.log("🗑️ Canceling appointment:", appointmentId, "for user:", req.user.id);

    // First check if appointment exists and belongs to user
    const [existing] = await db.execute(
      "SELECT id FROM appointments WHERE id = ? AND user_id = ?",
      [appointmentId, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Delete the appointment
    await db.execute(
      "DELETE FROM appointments WHERE id = ? AND user_id = ?",
      [appointmentId, req.user.id]
    );

    console.log("✅ Appointment canceled successfully");
    res.json({ message: "Appointment canceled successfully" });
  } catch (err) {
    console.error("Error canceling appointment:", err);
    res.status(500).json({ error: "Server error" });
  }
};
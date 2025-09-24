import { getDB } from "../config/db.js";

// Book appointment
export async function bookAppointment(req, res) {
  try {
    const { department, doctor, appointment_date, appointment_time } = req.body;

    if (!department || !doctor || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const db = getDB();
    await db.execute(
      "INSERT INTO appointments (user_id, department, doctor, appointment_date, appointment_time) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, department, doctor, appointment_date, appointment_time]
    );

    res.json({ message: "Appointment booked successfully" });
  } catch (err) {
    console.error("Book appointment error:", err);
    res.status(500).json({ error: "Failed to book appointment" });
  }
}

// Get all appointments for logged-in user
export async function getAppointments(req, res) {
  try {
    const db = getDB();
    const [rows] = await db.execute(
      "SELECT * FROM appointments WHERE user_id = ? ORDER BY appointment_date, appointment_time",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch appointments error:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
}

// Cancel appointment
export async function cancelAppointment(req, res) {
  try {
    const db = getDB();
    const [result] = await db.execute(
      "DELETE FROM appointments WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error("Cancel appointment error:", err);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
}

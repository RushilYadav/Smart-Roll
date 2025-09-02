import express from "express";
import db from "../db.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get student profile (logged-in student)
router.get("/me", verifyToken, verifyRole("Student"), async (req, res) => {
  try {
    const result = await db.query("SELECT id, name, email, role, dob, profile_pic_url FROM users WHERE id = $1", [req.user.id]);
    const student = result.rows[0];
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch student profile" });
  }
});

export default router;

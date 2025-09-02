import express from "express";
import db from "../db.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get teacher profile (logged-in teacher)
router.get("/me", verifyToken, verifyRole("Teacher"), async (req, res) => {
  try {
    const result = await db.query("SELECT id, name, email, role, dob, profile_pic_url FROM users WHERE id = $1", [req.user.id]);
    const teacher = result.rows[0];
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teacher profile" });
  }
});

export default router;

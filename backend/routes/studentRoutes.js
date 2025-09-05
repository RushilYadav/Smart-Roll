import express from "express";
import db from "../db.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

//get student profile
router.get("/me", verifyToken, verifyRole("Student"), async (req, response) => {
  try {
    const result = await db.query("SELECT id, name, email, role, dob, profile_pic_url FROM users WHERE id = $1", [req.user.id]);
    const student = result.rows[0];
    if (!student) return response.status(404).json({ error: "Student not found" });
    response.json(student);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Failed to fetch student profile" });
  }
});

export default router;

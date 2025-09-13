import express from "express";
import db from "../db.js";
import { verifyToken, verifyRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

//get teacher profile
router.get("/classes/:classId/students", verifyToken, verifyRoles(["Teacher", "Admin"]), async (req, response) => {
  try {
    const { classId } = req.params;

    const classCheck = await db.query(
      "SELECT * FROM classes WHERE id = $1",
      [classId]
    );
    if (classCheck.rows.length === 0) {
      return response.status(404).json({ error: "Class not found" });
    }
    const cls = classCheck.rows[0];
    if (req.user.role !== "Admin" && cls.teacher_id !== req.user.id) {
      return response.status(403).json({ error: "You do not have access to this class" });
    }
    const students = await db.query(`
      SELECT u.id, u.name, u.email, u.profile_pic_url
      FROM class_students cs
      JOIN users u ON cs.student_id = u.id
      WHERE cs.class_id = $1`,
      [classId]
    );
    response.json(students.rows);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Failed to fetch students" });
  }
});

//get classes for the logged-in teacher
router.get("/classes", verifyToken, verifyRoles(["Teacher", "Admin"]), async (req, response) => {
  try {
    const result = await db.query(`
      SELECT c.id, c.name
      FROM classes c
      WHERE c.teacher_id = $1`,
      [req.user.id]
    );
    response.json(result.rows);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Failed to fetch classes" });
  }
});

//get students in a specific class
router.get("/classes/:classId/students", verifyToken, verifyRoles(["Teacher", "Admin"]), async (req, response) => {
  try {
    const { classId } = req.params;
    //check if the class belongs to the logged-in teacher
    const classCheck = await db.query(
      "SELECT * FROM classes WHERE id = $1 AND teacher_id = $2",
      [classId, req.user.id]
    );
    if (classCheck.rows.length === 0) {
      return response.status(403).json({ error: "You do not have access to this class" });
    }

    //fetch students in the class
    const students = await db.query(`
      SELECT u.id, u.name, u.email
      FROM class_students cs
      JOIN users u ON cs.student_id = u.id
      WHERE cs.class_id = $1`,
      [classId]
    );
    response.json(students.rows);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Failed to fetch students" });
  }
});

export default router;
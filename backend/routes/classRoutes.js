import express from 'express';
import db from '../db.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

//retrieve all classes with their teachers and students
router.get('/', verifyToken, verifyRole('Admin'), async (req, response) => {
    try {
        //get all classes with their teachers
        const classResult = await db.query(`
        SELECT c.id AS class_id, c.name AS class_name, u.id AS teacher_id, u.name AS teacher_name
        FROM classes c
        JOIN users u ON c.teacher_id = u.id
        ORDER BY c.id ASC`
        );

        const classes = [];

        for (let cls of classResult.rows) {

            //get students for each class
            const studentResult = await db.query(`
                SELECT u.id, u.name, u.profile_picture_url
                FROM class_students cs
                JOIN users u ON cs.student_id = u.id
                WHERE cs.class_id = $1`,
                [cls.class_id]
            );

            classes.push({
                id: cls.class_id,
                name: cls.class_name,
                teacherId: cls.teacher_id,
                teacherName: cls.teacher_name,
                students: studentResult.rows,
            });
        }

        response.json(classes);
    } catch (err) {
        console.error('Error fetching classes:', err);
        response.status(500).json({ error: 'Failed to fetch classes' });
    }
});

//create a new class
router.post('/', verifyToken, verifyRole('Admin'), async (req, response) => {
    const { name, teacherId, studentIds } = req.body;

    if (!name || !teacherId) return response.status(400).json({ error: 'Class name and teacher are required' });

    try {
        //insert new class into classes table
        const result = await db.query(
        `INSERT INTO classes (name, teacher_id) VALUES ($1, $2) RETURNING id, name, teacher_id`,
        [name, teacherId]
        );

        const newClass = result.rows[0];

        //insert students into class_students table
        if (studentIds && studentIds.length > 0) {
            const values = studentIds.map((id) => `(${newClass.id}, ${id})`).join(',');
            await db.query(`INSERT INTO class_students (class_id, student_id) VALUES ${values}`);
        }

        //fetch teacher name
        const teacherResult = await db.query('SELECT name FROM users WHERE id = $1', [teacherId]);

        response.status(201).json({
            message: 'Class created successfully',
            class: {
                id: newClass.id,
                name: newClass.name,
                teacherId: newClass.teacher_id,
                teacherName: teacherResult.rows[0].name,
                students: [],
            },
        });
    } catch (err) {
        console.error('Error creating class:', err);
        response.status(500).json({ error: 'Failed to create class' });
    }
});

//update a class
router.put('/:id', verifyToken, verifyRole('Admin'), async (req, response) => {
    const classId = req.params.id;
    const { name, teacherId, studentIds } = req.body;

    try {
        //update class details
        const result = await db.query(
        `UPDATE classes SET name = $1, teacher_id = $2 WHERE id = $3 RETURNING id, name, teacher_id`,
        [name, teacherId, classId]
        );

        if (result.rowCount === 0) return response.status(404).json({ error: 'Class not found' });

        //remove existing students
        await db.query('DELETE FROM class_students WHERE class_id = $1', [classId]);

        //add new students
        if (studentIds && studentIds.length > 0) {
            const values = studentIds.map((id) => `(${classId}, ${id})`).join(',');
            await db.query(`INSERT INTO class_students (class_id, student_id) VALUES ${values}`);
        }

        //fetch teacher name
        const teacherResult = await db.query('SELECT name FROM users WHERE id = $1', [teacherId]);

        response.json({
            message: 'Class updated successfully',
            class: {
                id: result.rows[0].id,
                name: result.rows[0].name,
                teacherId: result.rows[0].teacher_id,
                teacherName: teacherResult.rows[0].name,
                students: [],
            },
        });
    } catch (err) {
        console.error('Error updating class:', err);
        response.status(500).json({ error: 'Failed to update class' });
    }
});

//delete a class
router.delete('/:id', verifyToken, verifyRole('Admin'), async (req, response) => {
const classId = req.params.id;

try {
    //delete students from class_students table
    await db.query('DELETE FROM class_students WHERE class_id = $1', [classId]);

    //delete class from classes table
    const result = await db.query('DELETE FROM classes WHERE id = $1 RETURNING id', [classId]);

    if (result.rowCount === 0) return response.status(404).json({ error: 'Class not found' });
        response.json({ message: 'Class deleted successfully' });

    } catch (err) {
        console.error('Error deleting class:', err);
        response.status(500).json({ error: 'Failed to delete class' });
    }
});

export default router;
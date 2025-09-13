import db from '../db.js';

//get all classes with teacher and students
export const getClasses = async (req, response) => {
    try {

        //get all classes with their teachers
        const classesResult = await db.query(`
            SELECT c.id AS class_id, c.name AS class_name, u.id AS teacher_id, u.name AS teacher_name
            FROM classes c
            JOIN users u ON c.teacher_id = u.id
            ORDER BY c.id ASC`
        );
        const classes = [];

        //for each class, get its students
        for (const cls of classesResult.rows) {
            const studentsResult = await db.query(`
            SELECT u.id, u.name, u.profile_picture_url
            FROM class_students cs
            JOIN users u ON cs.student_id = u.id
            WHERE cs.class_id = $1`,
            [cls.class_id]);

            classes.push({
            id: cls.class_id,
            name: cls.class_name,
            teacherId: cls.teacher_id,
            teacherName: cls.teacher_name,
            students: studentsResult.rows
            });
        }

        response.json(classes);
    } catch (err) {
        console.error('Error fetching classes:', err);
        response.status(500).json({ error: 'Failed to fetch classes' });
    }
};

//create a new class
export const createClass = async (req, response) => {
    const { name, teacherId, studentIds } = req.body;

    if (!name || !teacherId) {
        return response.status(400).json({ error: 'Class name and teacherId are required' });
    }

    try {
        //insert new class into classes table
        const classResult = await db.query(
        'INSERT INTO classes (name, teacher_id) VALUES ($1, $2) RETURNING id, name, teacher_id',
        [name, teacherId]
        );

        const newClass = classResult.rows[0];

        //insert students into class_students table
        if (studentIds && studentIds.length > 0) {
        for (const studentId of studentIds) {
            await db.query(
            'INSERT INTO class_students (class_id, student_id) VALUES ($1, $2)',
            [newClass.id, studentId]
            );
        }
        }

        response.status(201).json({ message: 'Class created successfully', class: newClass });
    } catch (err) {
        console.error('Error creating class:', err);
        response.status(500).json({ error: 'Failed to create class' });
    }
};

//update a class
export const updateClass = async (req, response) => {
    const { id } = req.params;
    const { name, teacherId, studentIds } = req.body;

    try {
        //update class info
        const classResult = await db.query(
        'UPDATE classes SET name = $1, teacher_id = $2 WHERE id = $3 RETURNING id, name, teacher_id',
        [name, teacherId, id]
        );

        if (classResult.rowCount === 0) {
        return response.status(404).json({ error: 'Class not found' });
        }

        //remove existing students
        await db.query('DELETE FROM class_students WHERE class_id = $1', [id]);

        //add new students
        if (studentIds && studentIds.length > 0) {
        for (const studentId of studentIds) {
            await db.query(
            'INSERT INTO class_students (class_id, student_id) VALUES ($1, $2)',
            [id, studentId]
            );
        }
        }

        response.json({ message: 'Class updated successfully', class: classResult.rows[0] });
    } catch (err) {
        console.error('Error updating class:', err);
        response.status(500).json({ error: 'Failed to update class' });
    }
};

//delete a class
export const deleteClass = async (req, response) => {
    const { id } = req.params;

    try {
        //delete students from class_students table
        await db.query('DELETE FROM class_students WHERE class_id = $1', [id]);

        //delete class from classes table
        const classResult = await db.query('DELETE FROM classes WHERE id = $1 RETURNING id', [id]);

        if (classResult.rowCount === 0) {
        return response.status(404).json({ error: 'Class not found' });
        }

        response.json({ message: 'Class deleted successfully' });
    } catch (err) {
        console.error('Error deleting class:', err);
        response.status(500).json({ error: 'Failed to delete class' });
    }
};
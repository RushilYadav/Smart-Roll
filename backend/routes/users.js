import express from 'express'; 
import db from '../db.js';
import bcrypt from 'bcrypt';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all users (Admin only)
router.get('/all', verifyToken, verifyRole('Admin'), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, dob, profile_pic_url FROM users ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// CREATE a new user (Admin only)
router.post('/', verifyToken, verifyRole('Admin'), async (req, res) => {
  const { name, email, role, dob, profile_pic_url, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({ error: 'Name, email, role, and password are required' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, role, dob, profile_pic_url, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role, dob, profile_pic_url`,
      [name, email, role, dob || null, profile_pic_url || null, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// UPDATE a user by ID (Admin only)
router.put('/:id', verifyToken, verifyRole('Admin'), async (req, res) => {
  const { id } = req.params;
  const { name, email, role, dob, profile_pic_url } = req.body;

  try {
    const result = await db.query(
      `UPDATE users 
       SET name = $1, email = $2, role = $3, dob = $4, profile_pic_url = $5
       WHERE id = $6
       RETURNING id, name, email, role, dob, profile_pic_url`,
      [name, email, role, dob, profile_pic_url, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User updated successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE a user by ID (Admin only)
router.delete('/:id', verifyToken, verifyRole('Admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;

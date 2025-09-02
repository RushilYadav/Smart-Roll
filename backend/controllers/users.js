import db from '../db.js';

export const getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, dob, profile_pic_url FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

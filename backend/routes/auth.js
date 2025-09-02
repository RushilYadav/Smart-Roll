import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js'; // correct path
import { verifyToken } from '../middleware/authMiddleware.js'; // correct path

const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  const { name, email, password, role, dob, profile_pic_url } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (name, email, password_hash, role, dob, profile_pic_url) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, email, hashedPassword, role, dob, profile_pic_url]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for:', email); // <-- log email trying to login

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Query result:', result.rows); // <-- log what the database returned

    const user = result.rows[0];

    if (!user) {
      console.log('No user found with that email'); // optional
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid?', validPassword); // <-- log bcrypt result

    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login route error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});


export default router;

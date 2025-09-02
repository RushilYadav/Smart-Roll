import express from 'express';
import { getAllUsers } from '../controllers/users.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/all', verifyToken, verifyRole('Admin'), getAllUsers);

export default router;

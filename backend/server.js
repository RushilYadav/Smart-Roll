import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5178' }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));

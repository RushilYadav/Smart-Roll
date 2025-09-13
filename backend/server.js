import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import TeacherRoutes from './routes/teacherRoutes.js';
import StudentRoutes from './routes/studentRoutes.js';
import classRoutes from './routes/classRoutes.js';
import cors from 'cors';
import path from 'path';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5178' }));
app.use(express.json());

app.use('/images', express.static(path.join(process.cwd(), 'images')));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/teacher', TeacherRoutes);
app.use('/students', StudentRoutes);
app.use('/classes', classRoutes);
app.use('/upload', uploadRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
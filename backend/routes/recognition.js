import express from 'express';
import { spawn } from 'child_process';
const router = express.Router();

router.post('/start-recognition', (req, res) => {
    const pythonProcess = spawn('python', ['../facial_recognition/facial_recognition.py']);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
    });
    res.json({ message: 'Facial recognition started' });
});

export default router;
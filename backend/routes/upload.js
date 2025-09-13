import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: function (req, file, cb) {
        
        const ext = path.extname(file.originalname);
        const timestamp = Date.now();
        cb(null, `temp-${timestamp}${ext}`);
    }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, response) => {
    if (!req.file) return response.status(400).json({ error: 'No file uploaded' });
    
    const studentName = req.body.name;
    if (!studentName) return response.status(400).json({ error: 'No name provided' });

    const ext = path.extname(req.file.filename);
    const safeName = studentName.replace(/\s+/g, '_');
    const newFilename = `${safeName}${ext}`;
    const newPath = path.join(req.file.destination, newFilename);

    fs.rename(req.file.path, newPath, (err) => {
        if (err) {
            console.error('Error renaming file:', err);
            return response.status(500).json({ error: 'Error processing file' });
        }

        const imageUrl = `http://localhost:5000/images/${newFilename}`;
        response.json({ url: imageUrl });
    });

});

export default router;
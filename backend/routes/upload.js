import express from 'express';
import { url } from 'inspector';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

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
        cb(null, `${file.fieldname}-${timestamp}${ext}`);
    }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, response) => {
    if (!req.file) return response.status(400).json({ error: 'No file uploaded' });
    const imageUrl = `http://localhost:5000/images/${req.file.filename}`;
    response.json({ url: imageUrl });
});

export default router;
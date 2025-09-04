// backend/routes/recordingRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const recordingController = require('../controllers/recordingController');

// Multer config for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Define the routes
router.post('/', upload.single('video'), recordingController.uploadRecording);
router.get('/', recordingController.getAllRecordings);
router.get('/:id', recordingController.streamRecording);

module.exports = router;
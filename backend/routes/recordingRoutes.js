// backend/routes/recordingRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const recordingController = require('../controllers/recordingController');
require('dotenv').config();

// Configure AWS S3 Client
const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// Configure multer to use S3 for storage
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, `recording-${Date.now().toString()}${file.originalname}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE // Automatically set Content-Type
    })
});

// Define the routes (note the upload middleware is the new one)
router.post('/', upload.single('video'), recordingController.uploadRecording);
router.get('/', recordingController.getAllRecordings);
router.get('/:id', recordingController.streamRecording);

module.exports = router;
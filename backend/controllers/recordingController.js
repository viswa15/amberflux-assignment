// backend/controllers/recordingController.js
const Recording = require('../models/recordingModel');
const fs = require('fs');
const path = require('path');

// Handle new recording upload
exports.uploadRecording = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    try {
        const { filename, path: filepath, size: filesize } = req.file;
        const newRecording = await Recording.create({ filename, filepath, filesize });
        res.status(201).json({ message: 'Recording uploaded successfully', recording: newRecording });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save recording to database.' });
    }
};

// Get a list of all recordings
exports.getAllRecordings = async (req, res) => {
    try {
        const rows = await Recording.findAll();
        const recordings = rows.map(row => ({
          ...row,
          url: `${req.protocol}://${req.get('host')}/api/recordings/${row.id}`
        }));
        res.status(200).json(recordings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch recordings.' });
    }
};

// Stream a specific recording
exports.streamRecording = async (req, res) => {
    try {
        const { id } = req.params;
        const recording = await Recording.findById(id);

        if (!recording) {
            return res.status(404).json({ message: 'Recording not found.' });
        }
        
        const filePath = path.join(__dirname, '..', recording.filepath);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server.' });
        }
        
        res.setHeader('Content-Type', 'video/webm');
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: 'Server error while streaming file.' });
    }
};
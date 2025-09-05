// backend/controllers/recordingController.js
const Recording = require('../models/recordingModel');

exports.uploadRecording = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    try {
        const { key, location, size } = req.file;
        // 'key' is the filename in S3, 'location' is the public URL
        const newRecording = await Recording.create({ filename: key, filepath: location, filesize: size });
        res.status(201).json({ message: 'Recording uploaded successfully to S3', recording: newRecording });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save recording information.' });
    }
};

exports.getAllRecordings = async (req, res) => {
    try {
        const rows = await Recording.findAll();
        // The URL is now the direct S3 path, which we already stored
        const recordings = rows.map(row => ({
            ...row,
            url: row.filepath 
        }));
        res.status(200).json(recordings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch recordings.' });
    }
};

// The streaming endpoint is now just a redirect!
exports.streamRecording = async (req, res) => {
    try {
        const { id } = req.params;
        const recording = await Recording.findById(id);

        if (!recording) {
            return res.status(404).json({ message: 'Recording not found.' });
        }
        
        // Redirect the client's browser directly to the S3 URL
        res.redirect(recording.filepath);

    } catch (error) {
        res.status(500).json({ message: 'Server error while finding recording.' });
    }
};
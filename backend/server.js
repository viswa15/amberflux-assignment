// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDb } = require('./config/database');

const recordingRoutes = require('./routes/recordingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDb();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Statically serve the uploads folder so files are accessible
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/recordings', recordingRoutes);

// Start Server
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
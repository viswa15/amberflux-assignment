// backend/config/database.js
const sqlite3 = require('sqlite3').verbose();

// Connect to the database file
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Function to initialize the database table
const initDb = () => {
    db.run(`CREATE TABLE IF NOT EXISTS recordings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        filepath TEXT NOT NULL,
        filesize INTEGER NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
};

module.exports = { db, initDb };
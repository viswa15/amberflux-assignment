// backend/models/recordingModel.js
const { db } = require('../config/database');

// Create a new recording record
exports.create = (data) => {
    return new Promise((resolve, reject) => {
        const { filename, filepath, filesize } = data;
        const sql = `INSERT INTO recordings (filename, filepath, filesize) VALUES (?, ?, ?)`;
        db.run(sql, [filename, filepath, filesize], function(err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, ...data });
        });
    });
};

// Find all recordings
exports.findAll = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, filename, filesize, createdAt FROM recordings ORDER BY createdAt DESC`;
        db.all(sql, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Find a single recording by its ID
exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM recordings WHERE id = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};
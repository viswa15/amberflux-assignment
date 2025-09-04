// backend/models/recordingModel.js
const db = require('../config/database');

exports.create = async (data) => {
    const { filename, filepath, filesize } = data;
    const sql = `INSERT INTO recordings (filename, filepath, filesize) VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await db.query(sql, [filename, filepath, filesize]);
    return rows[0];
};

exports.findAll = async () => {
    const sql = `SELECT id, filename, filesize, "createdAt" FROM recordings ORDER BY "createdAt" DESC`;
    const { rows } = await db.query(sql);
    return rows;
};

exports.findById = async (id) => {
    const sql = `SELECT * FROM recordings WHERE id = $1`;
    const { rows } = await db.query(sql, [id]);
    return rows[0];
};
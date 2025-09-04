// backend/config/database.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Render's managed DB
    }
});

const initDb = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS recordings (
            id SERIAL PRIMARY KEY,
            filename TEXT NOT NULL,
            filepath TEXT NOT NULL,
            filesize BIGINT NOT NULL,
            "createdAt" TIMESTAMPTZ DEFAULT NOW()
        );
    `;
    try {
        await pool.query(createTableQuery);
        console.log('Database table checked/created successfully.');
    } catch (err) {
        console.error('Error creating database table:', err);
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    initDb
};
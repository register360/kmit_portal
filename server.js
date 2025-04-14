require('dotenv').config();
const express = require('express');
const { Pool } = require('pg'); // Changed from mysql2 to pg
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// Security middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://kmit_portal_user:gajFy4M7Xb8GKgz8TxJLajkioNfRAItQ@dpg-cvuakjidbo4c739g7dj0-a.oregon-postgres.render.com/kmit_portal',
  ssl: {
    rejectUnauthorized: false // Required for Render PostgreSQL
  }
});

// Database initialization
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        mobile_number VARCHAR(15) NOT NULL,
        roll_no VARCHAR(10) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        branch VARCHAR(50) NOT NULL,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    client.release();
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

initializeDatabase();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'college.html'));
});

app.post('/submit', async (req, res) => {
  let client;
  try {
    const { name, number, rollno, password, branch } = req.body;
    
    if (!name || !number || !rollno || !password || !branch) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    client = await pool.connect();
    const existing = await client.query(
      'SELECT * FROM students WHERE roll_no = $1', [rollno]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Roll number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      'INSERT INTO students (name, mobile_number, roll_no, password, branch) VALUES ($1, $2, $3, $4, $5)',
      [name, number, rollno, hashedPassword, branch]
    );

    res.json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  } finally {
    if (client) client.release();
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

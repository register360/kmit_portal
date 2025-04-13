require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kmit_portal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create students table if not exists
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                mobile_number VARCHAR(15) NOT NULL,
                roll_no VARCHAR(10) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                branch VARCHAR(50) NOT NULL,
                registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        connection.release();
        console.log('Database initialized');
    } catch (err) {
        console.error('Database initialization error:', err);
    }
}

initializeDatabase();

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'college.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        const { name, number, rollno, password, branch } = req.body;
        
        // Basic validation
        if (!name || !number || !rollno || !password || !branch) {
            return res.status(400).send('All fields are required');
        }

        // Check if roll number already exists
        const [existing] = await pool.query(
            'SELECT * FROM students WHERE roll_no = ?',
            [rollno]
        );
        
        if (existing.length > 0) {
            return res.status(400).send('Roll number already registered');
        }

        // Insert into database
        await pool.query(
            'INSERT INTO students (name, mobile_number, roll_no, password, branch) VALUES (?, ?, ?, ?, ?)',
            [name, number, rollno, password, branch]
        );

        res.send(`
            <script>
                alert('Registration successful!');
                window.location.href = '/';
            </script>
        `);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(`
            <script>
                alert('Registration failed. Please try again.');
                window.location.href = '/';
            </script>
        `);
    }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
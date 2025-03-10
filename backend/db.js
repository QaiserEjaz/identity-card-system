const mysql = require('mysql2');

// MySQL database connection settings
const db = mysql.createConnection({
    host: 'localhost', // XAMPP default MySQL host
    user: 'root', // Default username
    password: '', // Leave blank if no password
    database: 'IdentityCardDB', // Database created in PHPMyAdmin
});

// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL via XAMPP');

    // Create table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS cards (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            fathername VARCHAR(255) NOT NULL,
            cnic CHAR(13) NOT NULL CHECK (cnic REGEXP '^[0-9]{13}$'),
            dob DATE NOT NULL,
            address TEXT NOT NULL,
            photo VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

    db.query(createTableQuery, (err) => {
        if (err) throw err;
        console.log('Cards table created or already exists');
    });
});

module.exports = db;

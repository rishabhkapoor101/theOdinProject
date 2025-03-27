require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

// Test database connection
pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error("Database connection error:", err));

// API endpoint to add a new user
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    // Validate incoming data
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields (name, email, password) are required." });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Insert the user into the database
        const result = await pool.query(
            "INSERT INTO application_v1.users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hashedPassword]
        );

        // Respond with the created user
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ error: err.message });
    }
});

// API endpoint to handle login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validate incoming data
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        // Retrieve the user from the database
        const result = await pool.query(
            "SELECT * FROM application_v1.users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        const user = result.rows[0];

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // If passwords match, you can send a success response or generate a token
            res.status(200).json({ message: "Login successful", user: user });
        } else {
            // If passwords don't match
            res.status(400).json({ error: "Invalid email or password." });
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/connection");

// Register user
const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query("INSERT INTO users (username, password) VALUES (?, ?)", 
            [username, hashedPassword], 
            (err, result) => {
                if (err) return res.status(500).json(err);
                res.status(201).json({ message: "User registered" });
            }
        );
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Login user
const loginUser = (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
        if (err || results.length === 0) 
            return res.status(401).json({ message: "Invalid credentials" });
        
        const isValid = await bcrypt.compare(password, results[0].password);
        if (!isValid) 
            return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: results[0].id }, "secret", { expiresIn: "1h" });
        res.json({ token });
    });
};

module.exports = { registerUser, loginUser };
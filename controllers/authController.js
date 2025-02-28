const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = (req, res) => {
    const { username, password, role } = req.body;

    if (!['stakeholder', 'researcher'].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Choose between ‘stakeholder’ or ‘researcher’." });
    }

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
    
        if (results.length > 0) { 
            return res.status(400).json({ message: "Already registered user" });
        }
    
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: "Hashing Error" });
    
            db.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
                [username, hashedPassword, role], 
                (err) => {
                    if (err) return res.status(500).json({ message: "Registration error" });
                    res.json({ message: `Registration completed as ${role}` });
                }
            );
        });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
    
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    
        const user = results[0]; 
    
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) return res.status(500).json({ message: "Invalid password" });
            if (!match) return res.status(401).json({ message: "Invalid credentials" });
    
             // Genera il token JWT
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.json({ message: "Login successful", token });
        });
    });
};

// Middleware per proteggere le rotte
exports.authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        
        req.user = decoded; // Salviamo i dati dell'utente nel request
        next();
    });
};

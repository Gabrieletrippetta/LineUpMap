require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Errore nella connessione a MySQL:", err);
    } else {
        console.log("Connesso al database:", process.env.DB_NAME);
    }
});

// Test query per verificare se la connessione funziona
db.query("SELECT COUNT(*) AS count FROM users", (err, result) => {
    if (err) console.error("Errore nella query di test:", err);
    else console.log("Numero utenti nel database:", result[0].count);
});

module.exports = db;

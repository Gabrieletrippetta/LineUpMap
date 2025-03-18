require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const cors = require('cors'); 

const authController = require('./controllers/authController');
const db = require('./config/database'); // Importa il database MySQL

const multer = require('multer');

// Configurazione Multer per salvare i file nella cartella "uploads"
const upload = multer({ dest: 'uploads/' });

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json());

// Routes for authentication and user management
app.post('/register', authController.register);
app.post('/login', authController.login);

// Rotte protette con autenticazione
app.get('/profile', authController.authenticateJWT, (req, res) => {
    res.json({ message: "Welcome to your profile", user: req.user });
});

const uploadsDir = path.join(__dirname, 'uploads');

const countries = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "CH", "UK"];

app.post('/upload-xlsx', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Nessun file caricato" });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    fs.unlinkSync(filePath); // Rimuove il file dopo la lettura

    res.json(jsonData); // Restituisce i dati estratti al client
});


// API di ricerca con filtri avanzati
app.get('/search', (req, res) => {
    const { q, country, education, availability } = req.query;
    let results = [];

    if (!q || q.trim() === "") {
        return res.status(400).json({ error: "Inserisci un termine di ricerca valido" });
    }

    if (results.length === 0) {
        return res.status(404).json({ error: "Nessun database trovato" });
    }

    res.json(results);
});

// Servire i file statici per il frontend
app.use(express.static('public'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Funzione per generare una finestra popup con grafico
app.get('/popup/:country/:file', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'popup.html'));
});

// API per ottenere i dati e il tipo di grafico
app.get('/chart/:country/:file/:type', (req, res) => {
    const country = req.params.country.toUpperCase();
    const fileName = req.params.file;
    const chartType = req.params.type; // Tipo di grafico richiesto

    if (!countries.includes(country)) {
        return res.status(400).json({ error: 'Nazione non supportata' });
    }

    const filePath = path.join(csvDir, country, fileName);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File non trovato' });
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Errore nella lettura del file' });
        }
        const rows = data.trim().split("\n").map(row => row.split(","));
        const headers = rows.shift();
        const jsonData = rows.map(row => Object.fromEntries(row.map((val, i) => [headers[i], val])));
        res.json({ type: chartType, data: jsonData });
    });
});

//API call for analytics
app.use((req, res, next) => {
    console.log(`API Call: ${req.method} ${req.url}`);
    next();
});

// Feedback API

const feedback = [];

app.post('/feedback', (req, res) => {
    const { message } = req.body;
    feedback.push({ message, timestamp: new Date() });
    res.json({ message: "Feedback submitted successfully" });
});

app.get('/feedback', (req, res) => {
    res.json(feedback);
});

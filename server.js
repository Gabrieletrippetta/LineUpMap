require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const chokidar = require('chokidar');
const cors = require('cors'); 

const authController = require('./controllers/authController');
const db = require('./config/database'); // Importa il database MySQL

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
const csvDir = path.join(__dirname, 'csv');

const countries = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "CH", "UK"];

// Creare cartelle per ogni nazione
countries.forEach(country => {
    const countryUploadPath = path.join(uploadsDir, country);
    const countryCsvPath = path.join(csvDir, country);
    if (!fs.existsSync(countryUploadPath)) {
        fs.mkdirSync(countryUploadPath, { recursive: true });
    }
    if (!fs.existsSync(countryCsvPath)) {
        fs.mkdirSync(countryCsvPath, { recursive: true });
    }
});

// Funzione per convertire xlsx in csv
function convertXlsxToCsv(targetFile, country) {
    const workbook = xlsx.readFile(targetFile);
    const sheetName = workbook.SheetNames[0];
    const csvFile = path.join(csvDir, country, path.basename(targetFile, '.xlsx') + '.csv');
    
    const csvData = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    fs.writeFileSync(csvFile, csvData);
    console.log(`Converted: ${targetFile} -> ${csvFile}`);
}

// Monitoraggio della cartella "uploads" per nuovi file .xlsx
chokidar.watch(uploadsDir, { persistent: true, depth: 1 }).on('add', filePath => {
    if (path.extname(filePath) === '.xlsx') {
        const country = path.basename(path.dirname(filePath));
        if (countries.includes(country)) {
            convertXlsxToCsv(filePath, country);
        }
    }
});

// API per ottenere il contenuto di un file CSV di una nazione
app.get('/data/:country/:file', (req, res) => {
    const country = req.params.country.toUpperCase();
    const fileName = req.params.file;
    
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
        res.json(jsonData);
    });
});

// API per ottenere l'elenco dei file CSV disponibili per una nazione
app.get('/data/:country', (req, res) => {
    const country = req.params.country.toUpperCase();
    if (!countries.includes(country)) {
        return res.status(400).json({ error: 'Nazione non supportata' });
    }
    const countryCsvPath = path.join(csvDir, country);
    fs.readdir(countryCsvPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Errore nel recupero dei file' });
        }
        res.json(files.filter(f => f.endsWith('.csv')));
    });
});

// API di ricerca con filtri avanzati
app.get('/search', (req, res) => {
    const { q, country, education, availability } = req.query;
    let results = [];

    if (!q || q.trim() === "") {
        return res.status(400).json({ error: "Inserisci un termine di ricerca valido" });
    }

    // Normalizza la query: rimuove spazi e underscore per una ricerca più flessibile
    const normalizedQuery = q.trim().toLowerCase().replace(/[_\s]+/g, ""); 

    countries.forEach(cntry => {
        const countryCsvPath = path.join(csvDir, cntry);
        if (!fs.existsSync(countryCsvPath)) return;

        fs.readdirSync(countryCsvPath).forEach(file => {
            const filePath = path.join(countryCsvPath, file);
            const data = fs.readFileSync(filePath, 'utf8');
            const rows = data.trim().split("\n").map(row => row.split(","));
            const headers = rows.shift();
            const jsonData = rows.map(row => 
                Object.fromEntries(row.map((val, i) => [headers[i], val.trim().toLowerCase()])) 
            );

            // 🔹 Normalizza il nome del file rimuovendo underscore e spazi
            const fileNameNormalized = file.toLowerCase().replace(".csv", "").replace(/[_\s]+/g, ""); 

            // 🔹 Cerca sia nei dati che nel nome file
            const matchesQuery = fileNameNormalized.includes(normalizedQuery) || 
                jsonData.some(row => Object.values(row).some(value => value.replace(/[_\s]+/g, "").includes(normalizedQuery)));

            const matchesCountry = (!country || country.toLowerCase() === "all") ? true : cntry === country.toUpperCase();
            const matchesEducation = education ? jsonData.some(row => row["Education Level"] && row["Education Level"].toLowerCase() === education.toLowerCase()) : true;
            const matchesAvailability = availability ? jsonData.some(row => row["Data Availability"] && row["Data Availability"].toLowerCase() === availability.toLowerCase()) : true;

            if (matchesQuery && matchesCountry && matchesEducation && matchesAvailability) {
                results.push({ country: cntry, file });
            }
        });
    });

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

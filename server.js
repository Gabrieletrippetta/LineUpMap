const express = require('express');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const chokidar = require('chokidar');
const cors = require('cors'); // Importa il modulo CORS
const app = express();
const PORT = 3000;

app.use(cors()); // Abilita CORS per tutte le richieste

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
const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer");
const XLSX = require("xlsx");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configura l'upload del file
const upload = multer({ dest: "uploads/" });

// Funzione per convertire Excel in CSV
function convertExcelToCSV(excelPath, csvPath) {
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0]; // Usa il primo foglio
    const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    
    fs.writeFileSync(csvPath, csvData);
    console.log(`✔ File convertito: ${csvPath}`);
}

// API per caricare il file Excel e convertirlo
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("❌ Nessun file caricato.");
    }

    const excelPath = req.file.path;
    const csvPath = `data/data.csv`;

    try {
        convertExcelToCSV(excelPath, csvPath);
        fs.unlinkSync(excelPath); // Elimina il file Excel originale
        res.send("✔ File Excel convertito in CSV con successo!");
    } catch (error) {
        res.status(500).send("❌ Errore nella conversione.");
    }
});

// API per ottenere i dati dal CSV convertito
app.get("/data", (req, res) => {
    let results = [];
    fs.createReadStream("data/data.csv")
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => res.json(results));
});

app.listen(port, () => console.log(`🚀 Server attivo su http://localhost:${port}`));

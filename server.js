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

const countries = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "CH", "UK"];


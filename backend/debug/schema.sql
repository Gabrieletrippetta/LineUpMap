-- Schema per il database dei dataset longitudinali
-- Questo script crea la tabella necessaria per memorizzare i dati dei dataset

CREATE DATABASE IF NOT EXISTS mapping_data CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mapping_data;

-- Tabella principale per i dataset
CREATE TABLE IF NOT EXISTS datasets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Informazioni base
    Name VARCHAR(500),
    Acronym VARCHAR(100),
    Description TEXT,
    Country VARCHAR(200),
    
    -- Organizzazione e struttura
    `Responsible Organization(s)` TEXT,
    `Longitudinal Data Structure` VARCHAR(100),
    `Type of Longitudinal Data` VARCHAR(200),
    Purpose TEXT,
    Focus TEXT,
    
    -- Temporalità
    `Data Collection Frequency` VARCHAR(100),
    `Starting Year` VARCHAR(50),
    `Ending Year` VARCHAR(50),
    
    -- Campionamento
    `Sample Level` VARCHAR(200),
    `Sample Level (Details)` TEXT,
    
    -- Gradi scolastici
    ECEC VARCHAR(50),
    `Included Grades` TEXT,
    `Students followed after school education` VARCHAR(50),
    
    -- Competenze e valutazioni
    `Skills Analysed` TEXT,
    `Measure Types` TEXT,
    `Administration Method` VARCHAR(200),
    
    -- Informazioni sul campione
    `Sample Types` TEXT,
    `Sampling Weights/Criteria` TEXT,
    `Avg Sample Size x Wave` VARCHAR(100),
    `Sample Units` TEXT,
    
    -- Linkabilità
    Linkability VARCHAR(200),
    `Linkability Details` TEXT,
    
    -- Accessibilità
    `Access to Microdata` VARCHAR(200),
    Constraints TEXT,
    Website VARCHAR(500),
    
    -- Variabili studente
    `Student Gender` VARCHAR(100),
    `Student Age` VARCHAR(100),
    `Student Citizenship` VARCHAR(100),
    `Student Foreign Birth Country` VARCHAR(100),
    `Student Specific Birth Country` VARCHAR(100),
    `Student Town of Residence` VARCHAR(100),
    `Student Province of Residence` VARCHAR(100),
    `Student Region of Residence` VARCHAR(100),
    `Student Belonging to a Recognised Ethnic Minority` VARCHAR(100),
    `Student ECEC Attendance` VARCHAR(100),
    `Student Previous Grade Retention` VARCHAR(100),
    `Student Learning Impairments` VARCHAR(100),
    `Student Physical Impairments` VARCHAR(100),
    `Student School Attitude or Motivation` VARCHAR(100),
    `Student Assigned Teacher Grades` VARCHAR(100),
    `Student Allowance/Scholarship` VARCHAR(100),
    `Student Information Type` TEXT,
    
    -- Variabili household
    `Number of Parents` VARCHAR(100),
    `Presence of Stepparents` VARCHAR(100),
    Siblings VARCHAR(100),
    `Parental Working Status` VARCHAR(100),
    `Parental Occupation` VARCHAR(100),
    `Parental Education` VARCHAR(100),
    `Parental Education Level (ISCED)` VARCHAR(100),
    `Parental Migratory Background` VARCHAR(100),
    `Parents Age` VARCHAR(100),
    `Parents Place Of Birth` VARCHAR(100),
    `Parental Income or Wealth` VARCHAR(100),
    `Parental Host Country's Language Proficiency` VARCHAR(100),
    `Number of Books` VARCHAR(100),
    `Number of Digital Devices` VARCHAR(100),
    `Ownership of the Apartment/House` VARCHAR(100),
    `Household Information Type` TEXT,
    
    -- Variabili insegnanti
    `Teacher Age` VARCHAR(100),
    `Teacher Gender` VARCHAR(100),
    `Teacher Seniority` VARCHAR(100),
    `Teacher Educational Degree` VARCHAR(100),
    `Teacher Contract Type` VARCHAR(100),
    `Teacher Information Type` TEXT,
    `Teacher Information Linkability` VARCHAR(100),
    
    -- Variabili scuola/classe
    `School Geo-Referencing` VARCHAR(100),
    `School Type` VARCHAR(100),
    `School Track` VARCHAR(100),
    `School Size` VARCHAR(100),
    `Class Size` VARCHAR(100),
    `School Composition` VARCHAR(100),
    `Class Composition` VARCHAR(100),
    
    -- Metadati
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indici per migliorare le performance
    INDEX idx_country (Country),
    INDEX idx_acronym (Acronym),
    INDEX idx_name (Name(255)),
    FULLTEXT INDEX idx_fulltext_search (Name, Acronym, Description, Country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Note:
-- 1. Ricordati di importare i dati dal tuo file JSON esistente
-- 2. Puoi aggiungere altri campi se necessario
-- 3. Gli indici FULLTEXT permettono ricerche testuali veloci

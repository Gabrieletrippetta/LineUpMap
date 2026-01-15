#!/usr/bin/env python3
"""
Script per importare mapping_data.json in MySQL
Esegui: python import_to_mysql.py
"""

import mysql.connector
import json
import sys

# =======================================================
# CONFIGURAZIONE DATABASE
# =======================================================
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',           
    'password': 'nuova_password',           
    'database': 'mapping_data'
}

# Percorso del file JSON
JSON_FILE = 'mapping_data.json'

# =======================================================
# FUNZIONI
# =======================================================

def abbreviate_column_name(name):
    """Abbrevia i nomi delle colonne per rispettare il limite MySQL"""
    import re
    name = re.sub(r'[^\w\s]', '', name)
    name = re.sub(r'\s+', '_', name)
    name = name.strip('_').lower()
    
    replacements = {
        'responsible': 'resp', 'organization': 'org', 'university': 'univ',
        'public': 'pub', 'research': 'res', 'centre': 'ctr', 'authority': 'auth',
        'private': 'priv', 'longitudinal': 'long', 'structure': 'struct',
        'collection': 'coll', 'purpose': 'purp', 'academic': 'acad',
        'system': 'sys', 'monitoring': 'mon', 'evaluation': 'eval',
        'educational': 'edu', 'institutions': 'inst', 'individuals': 'indiv',
        'assessment': 'asmt', 'education': 'edu', 'transition': 'trans',
        'household': 'house', 'family': 'fam', 'development': 'dev',
        'frequency': 'freq', 'information': 'info', 'preprimary': 'preprim',
        'included': 'incl', 'students': 'stud', 'followed': 'foll',
        'analysed': 'anlyz', 'literacy': 'lit', 'numeracy': 'num',
        'science': 'sci', 'foreign': 'for', 'language': 'lang',
        'skills': 'skl', 'measure': 'meas', 'continuous': 'cont',
        'proficiency': 'prof', 'administration': 'admin', 'method': 'meth',
        'population': 'pop', 'sample': 'samp', 'random': 'rand',
        'average': 'avg', 'linkability': 'link', 'individual': 'indiv',
        'questionnaire': 'quest', 'headmaster': 'head', 'teachers': 'teach',
        'teacher': 'teach', 'parents': 'par', 'parent': 'par',
        'access': 'acc', 'micro': 'mic', 'constraints': 'constr',
        'download': 'dwnld', 'management': 'mgmt', 'official': 'off',
        'website': 'web', 'student': 'st', 'citizenship': 'citizen',
        'country': 'cntry', 'birth': 'brth', 'specific': 'spec',
        'residence': 'resid', 'province': 'prov', 'region': 'reg',
        'belonging': 'belong', 'recognised': 'recog', 'ethnic': 'ethn',
        'minority': 'min', 'attendance': 'attnd', 'previous': 'prev',
        'retention': 'retent', 'learning': 'learn', 'impairments': 'impair',
        'physical': 'phys', 'attitude': 'attit', 'motivation': 'motiv',
        'assigned': 'assgn', 'grades': 'grd', 'allowance': 'allow',
        'scholarship': 'schlr', 'number': 'num', 'presence': 'pres',
        'stepparents': 'step', 'siblings': 'sibl', 'working': 'work',
        'status': 'stat', 'occupation': 'occup', 'isced': 'iscd',
        'migratory': 'migr', 'background': 'bg', 'place': 'plc',
        'income': 'inc', 'wealth': 'wlth', 'books': 'bks', 'digital': 'dgtl',
        'devices': 'dev', 'ownership': 'own', 'apartment': 'apt',
        'house': 'hse', 'seniority': 'senior', 'degree': 'deg',
        'contract': 'contr', 'georeferencing': 'geo', 'composition': 'comp',
        'linkable': 'link'
    }
    
    for old, new in replacements.items():
        name = name.replace(old, new)
    
    if len(name) > 64:
        name = name[:64]
    
    return name

def determine_mysql_type(key, data):
    """Determina il tipo MySQL appropriato per una colonna"""
    has_int = False
    has_string = False
    max_length = 0
    
    for record in data:
        value = record.get(key)
        if value is None or value == "":
            continue
        if isinstance(value, int):
            has_int = True
        elif isinstance(value, str):
            has_string = True
            max_length = max(max_length, len(value))
    
    if has_int and not has_string:
        return "INT"
    
    if max_length <= 50:
        return "VARCHAR(100)"
    elif max_length <= 255:
        return "VARCHAR(255)"
    elif max_length <= 500:
        return "VARCHAR(500)"
    else:
        return "TEXT"

def create_table(cursor, data):
    """Crea la tabella nel database"""
    print("Creazione tabella...")
    
    # Drop table se esiste
    cursor.execute("DROP TABLE IF EXISTS `mapping_data`")
    
    # Prepara le definizioni delle colonne
    columns = list(data[0].keys())
    column_definitions = ["id INT AUTO_INCREMENT PRIMARY KEY"]
    
    for col in columns:
        abbr = abbreviate_column_name(col)
        mysql_type = determine_mysql_type(col, data)
        column_definitions.append(f"`{abbr}` {mysql_type}")
    
    # Crea la tabella
    create_sql = f"""
    CREATE TABLE `mapping_data` (
        {',\n        '.join(column_definitions)}
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """
    
    cursor.execute(create_sql)
    print("✓ Tabella creata con successo")

def insert_data(cursor, conn, data):
    """Inserisce i dati nella tabella"""
    print(f"Inserimento di {len(data)} record...")
    
    columns = list(data[0].keys())
    clean_columns = [abbreviate_column_name(col) for col in columns]
    
    # Prepara la query INSERT
    placeholders = ', '.join(['%s'] * len(columns))
    insert_sql = f"INSERT INTO `mapping_data` (`{'`, `'.join(clean_columns)}`) VALUES ({placeholders})"
    
    # Inserisci i dati
    inserted = 0
    for record in data:
        values = []
        for col in columns:
            value = record.get(col)
            if value is None or value == "":
                values.append(None)
            else:
                values.append(value)
        
        cursor.execute(insert_sql, values)
        inserted += 1
        
        if inserted % 10 == 0:
            print(f"  Inseriti {inserted}/{len(data)} record...", end='\r')
    
    conn.commit()
    print(f"\n✓ Tutti i {inserted} record inseriti con successo")

def main():
    """Funzione principale"""
    print("="*60)
    print("IMPORTAZIONE MAPPING_DATA.JSON IN MySQL")
    print("="*60)
    
    # Carica il JSON
    try:
        print(f"\nCaricamento file {JSON_FILE}...")
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✓ File caricato: {len(data)} record trovati")
    except FileNotFoundError:
        print(f"✗ ERRORE: File {JSON_FILE} non trovato!")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"✗ ERRORE: File JSON non valido: {e}")
        sys.exit(1)
    
    # Connessione al database
    try:
        print(f"\nConnessione al database {DB_CONFIG['database']}...")
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("✓ Connesso al database")
    except mysql.connector.Error as e:
        print(f"✗ ERRORE di connessione: {e}")
        sys.exit(1)
    
    try:
        # Crea la tabella
        create_table(cursor, data)
        
        # Inserisci i dati
        insert_data(cursor, conn, data)
        
        # Verifica
        cursor.execute("SELECT COUNT(*) FROM mapping_data")
        count = cursor.fetchone()[0]
        print(f"\n✓ Verifica: {count} record presenti nel database")
        
        print("\n" + "="*60)
        print("IMPORTAZIONE COMPLETATA CON SUCCESSO!")
        print("="*60)
        
    except mysql.connector.Error as e:
        print(f"\n✗ ERRORE durante l'importazione: {e}")
        conn.rollback()
        sys.exit(1)
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
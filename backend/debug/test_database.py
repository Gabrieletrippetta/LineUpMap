#!/usr/bin/env python3
"""
Script di test rapido per verificare la connessione al database
"""

import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Carica variabili d'ambiente dal tuo file .env
load_dotenv()

# Leggi configurazione dal tuo .env
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'port': int(os.getenv('DB_PORT', 3306))
}

DB_NAME = os.getenv('DB_NAME', 'mapping_db')

print("=" * 60)
print("🔍 TEST CONNESSIONE DATABASE")
print("=" * 60)

print("\n📋 Configurazione letta da .env:")
print(f"   Host: {DB_CONFIG['host']}")
print(f"   User: {DB_CONFIG['user']}")
print(f"   Password: {'*' * len(DB_CONFIG['password']) if DB_CONFIG['password'] else '(vuota)'}")
print(f"   Port: {DB_CONFIG['port']}")
print(f"   Database: {DB_NAME}")

# Test 1: Connessione a MySQL
print("\n" + "=" * 60)
print("TEST 1: Connessione a MySQL")
print("=" * 60)

try:
    connection = mysql.connector.connect(**DB_CONFIG)
    if connection.is_connected():
        db_info = connection.get_server_info()
        print(f"✅ CONNESSO a MySQL Server version {db_info}")
        
        cursor = connection.cursor()
        cursor.execute("SELECT database();")
        record = cursor.fetchone()
        print(f"✅ Connesso al server MySQL correttamente")
        
        cursor.close()
        connection.close()
    else:
        print("❌ Connessione fallita")
        exit(1)
        
except Error as e:
    print(f"❌ ERRORE DI CONNESSIONE: {e}")
    print("\n💡 POSSIBILI CAUSE:")
    print("   1. MySQL non è in esecuzione")
    print("   2. Credenziali sbagliate nel file .env")
    print("   3. Host o porta sbagliati")
    print("\n🔧 SUGGERIMENTI:")
    print("   - Verifica che MySQL sia attivo")
    print("   - Controlla il file .env nella cartella del progetto")
    print("   - Prova: mysql -u root -p (da terminale)")
    exit(1)

# Test 2: Verifica esistenza database
print("\n" + "=" * 60)
print(f"TEST 2: Verifica database '{DB_NAME}'")
print("=" * 60)

try:
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    
    # Lista tutti i database
    cursor.execute("SHOW DATABASES")
    databases = [db[0] for db in cursor.fetchall()]
    
    print(f"\n📊 Database disponibili sul server:")
    for db in databases:
        marker = "  👉" if db == DB_NAME else "    "
        print(f"{marker} {db}")
    
    if DB_NAME in databases:
        print(f"\n✅ Database '{DB_NAME}' ESISTE!")
        
        # Connetti al database specifico
        cursor.close()
        connection.close()
        
        config_with_db = DB_CONFIG.copy()
        config_with_db['database'] = DB_NAME
        connection = mysql.connector.connect(**config_with_db)
        cursor = connection.cursor()
        
        # Test 3: Verifica tabelle
        print("\n" + "=" * 60)
        print(f"TEST 3: Verifica tabelle in '{DB_NAME}'")
        print("=" * 60)
        
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        if tables:
            print(f"\n✅ Tabelle trovate:")
            for table in tables:
                print(f"   - {table[0]}")
                
            # Test 4: Verifica dati nella tabella datasets
            if any('datasets' in str(table).lower() for table in tables):
                print("\n" + "=" * 60)
                print("TEST 4: Verifica dati nella tabella 'datasets'")
                print("=" * 60)
                
                cursor.execute("SELECT COUNT(*) FROM datasets")
                count = cursor.fetchone()[0]
                
                if count > 0:
                    print(f"\n✅ La tabella 'datasets' contiene {count} record!")
                    
                    # Mostra un esempio
                    cursor.execute("SELECT name, acronym, cntry FROM datasets LIMIT 3")
                    samples = cursor.fetchall()
                    
                    print(f"\n📄 Primi 3 dataset:")
                    for sample in samples:
                        print(f"   - {sample[0]} ({sample[1]}) - {sample[2]}")
                    
                    print("\n" + "=" * 60)
                    print("🎉 TUTTO OK! Il database è configurato correttamente")
                    print("=" * 60)
                    print("\n✅ Puoi avviare l'applicazione con: python app.py")
                    
                else:
                    print(f"\n⚠️  La tabella 'datasets' esiste ma è VUOTA!")
                    print("\n💡 Devi importare i dati:")
                    print("   1. Trova il tuo file JSON o Excel con i dataset")
                    print("   2. Esegui: python setup_database.py")
                    print("   3. Oppure importa manualmente con phpMyAdmin/MySQL Workbench")
            else:
                print(f"\n⚠️  Nessuna tabella 'datasets' trovata!")
                print("\n💡 Devi creare la tabella:")
                print("   Esegui: python setup_database.py")
        else:
            print(f"\n⚠️  Il database '{DB_NAME}' esiste ma è VUOTO (nessuna tabella)!")
            print("\n💡 Devi creare le tabelle e importare i dati:")
            print("   Esegui: python setup_database.py")
        
    else:
        print(f"\n❌ Database '{DB_NAME}' NON ESISTE!")
        print("\n💡 Devi creare il database:")
        print("   Esegui: python setup_database.py")
        print("   Oppure crea manualmente con:")
        print(f"   CREATE DATABASE {DB_NAME};")
    
    cursor.close()
    connection.close()
    
except Error as e:
    print(f"❌ ERRORE: {e}")

print("\n" + "=" * 60)

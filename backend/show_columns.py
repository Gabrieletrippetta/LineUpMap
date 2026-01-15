#!/usr/bin/env python3
"""
Script per verificare i nomi delle colonne nella tabella datasets
"""

import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'lineup_mapping_data'),
    'port': int(os.getenv('DB_PORT', 3306))
}

print("=" * 80)
print("🔍 STRUTTURA TABELLA datasets")
print("=" * 80)

try:
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()
    
    # Conta record
    cursor.execute("SELECT COUNT(*) FROM datasets")
    count = cursor.fetchone()[0]
    print(f"\n📊 Record nella tabella: {count}")
    
    # Mostra struttura
    cursor.execute("DESCRIBE datasets")
    columns = cursor.fetchall()
    
    print("\n📋 COLONNE NELLA TABELLA:")
    print(f"{'#':<4} {'Nome Colonna':<50} {'Tipo':<25} {'Null':<5}")
    print("-" * 85)
    for i, col in enumerate(columns, 1):
        print(f"{i:<4} {col[0]:<50} {col[1]:<25} {col[2]:<5}")
    
    # Mostra un record di esempio
    print("\n" + "=" * 80)
    print("📄 ESEMPIO DI RECORD (per vedere i dati):")
    print("=" * 80)
    
    cursor.execute("SELECT * FROM datasets LIMIT 1")
    sample = cursor.fetchone()
    
    if sample:
        column_names = [desc[0] for desc in cursor.description]
        print("\nPrimo record:")
        for col_name, value in zip(column_names, sample):
            display_value = str(value)[:100] if value else 'NULL'
            print(f"  {col_name}: {display_value}")
    
    cursor.close()
    connection.close()
    
    print("\n" + "=" * 80)
    print("💡 PROSSIMO PASSO:")
    print("=" * 80)
    print("\nConfronta i nomi delle colonne qui sopra con quelli che app.py usa:")
    print("  - Se sono uguali: app.py dovrebbe funzionare")
    print("  - Se sono diversi: devi modificare app.py per usare i nomi corretti")
    print("\nColonne che app.py cerca:")
    print("  - Country (o simile)")
    print("  - Name")
    print("  - Acronym")
    print("  - Description")
    print("  - ecc.")
    
except Error as e:
    print(f"\n❌ Errore: {e}")

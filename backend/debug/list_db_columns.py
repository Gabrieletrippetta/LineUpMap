"""
Script per estrarre tutti i nomi delle colonne del database
"""
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'lineup_mapping_data'),
    'port': int(os.getenv('DB_PORT', 3306))
}

try:
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor()
    
    # Query per ottenere tutte le colonne
    cursor.execute("DESCRIBE datasets")
    columns = cursor.fetchall()
    
    print("=" * 80)
    print("📋 TUTTE LE COLONNE DEL DATABASE 'datasets'")
    print("=" * 80)
    print(f"\nTotale colonne: {len(columns)}\n")
    
    # Raggruppa per prefisso
    student_cols = []
    teacher_cols = []
    parent_cols = []
    school_cols = []
    other_cols = []
    
    for col in columns:
        col_name = col[0]
        
        if col_name.startswith('st_'):
            student_cols.append(col_name)
        elif col_name.startswith('tch_'):
            teacher_cols.append(col_name)
        elif col_name.startswith('par_') or 'parent' in col_name.lower():
            parent_cols.append(col_name)
        elif col_name.startswith('sch_') or col_name.startswith('cls_'):
            school_cols.append(col_name)
        else:
            other_cols.append(col_name)
    
    # Stampa raggruppate
    print("🎓 STUDENT COLUMNS (prefisso 'st_'):")
    print("-" * 80)
    for col in sorted(student_cols):
        print(f"  {col}")
    print(f"\nTotale: {len(student_cols)} colonne\n")
    
    print("👨‍🏫 TEACHER COLUMNS (prefisso 'tch_'):")
    print("-" * 80)
    for col in sorted(teacher_cols):
        print(f"  {col}")
    print(f"\nTotale: {len(teacher_cols)} colonne\n")
    
    print("👨‍👩‍👧 PARENT/HOUSEHOLD COLUMNS (prefisso 'par_'):")
    print("-" * 80)
    for col in sorted(parent_cols):
        print(f"  {col}")
    print(f"\nTotale: {len(parent_cols)} colonne\n")
    
    print("🏫 SCHOOL/CLASS COLUMNS (prefisso 'sch_'/'cls_'):")
    print("-" * 80)
    for col in sorted(school_cols):
        print(f"  {col}")
    print(f"\nTotale: {len(school_cols)} colonne\n")
    
    print("📊 OTHER COLUMNS:")
    print("-" * 80)
    for col in sorted(other_cols):
        print(f"  {col}")
    print(f"\nTotale: {len(other_cols)} colonne\n")
    
    # Stampa anche tutte in ordine alfabetico per completezza
    print("=" * 80)
    print("📝 TUTTE LE COLONNE IN ORDINE ALFABETICO:")
    print("=" * 80)
    all_cols = [col[0] for col in columns]
    for col in sorted(all_cols):
        print(f"  {col}")
    
    # Salva su file
    with open('database_columns.txt', 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("TUTTE LE COLONNE DEL DATABASE 'datasets'\n")
        f.write("=" * 80 + "\n\n")
        
        f.write(f"Totale colonne: {len(columns)}\n\n")
        
        f.write("STUDENT COLUMNS:\n")
        f.write("-" * 80 + "\n")
        for col in sorted(student_cols):
            f.write(f"{col}\n")
        
        f.write(f"\nTEACHER COLUMNS:\n")
        f.write("-" * 80 + "\n")
        for col in sorted(teacher_cols):
            f.write(f"{col}\n")
        
        f.write(f"\nPARENT/HOUSEHOLD COLUMNS:\n")
        f.write("-" * 80 + "\n")
        for col in sorted(parent_cols):
            f.write(f"{col}\n")
        
        f.write(f"\nSCHOOL/CLASS COLUMNS:\n")
        f.write("-" * 80 + "\n")
        for col in sorted(school_cols):
            f.write(f"{col}\n")
        
        f.write(f"\nOTHER COLUMNS:\n")
        f.write("-" * 80 + "\n")
        for col in sorted(other_cols):
            f.write(f"{col}\n")
        
        f.write(f"\n\nALL COLUMNS (ALPHABETICAL):\n")
        f.write("=" * 80 + "\n")
        for col in sorted(all_cols):
            f.write(f"{col}\n")
    
    print("\n" + "=" * 80)
    print("✅ Output salvato anche in: database_columns.txt")
    print("=" * 80)
    
    cursor.close()
    connection.close()
    
except Error as e:
    print(f"❌ Errore: {e}")

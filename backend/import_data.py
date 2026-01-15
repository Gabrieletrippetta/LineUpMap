import json
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

# Configurazione database
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'mapping_db'),
    'port': int(os.getenv('DB_PORT', 3306))
}

def get_db_connection():
    """Crea e restituisce una connessione al database"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"❌ Errore di connessione al database: {e}")
        return None

def get_column_names(cursor):
    """Ottiene tutti i nomi delle colonne dalla tabella datasets"""
    cursor.execute("DESCRIBE datasets")
    columns = cursor.fetchall()
    # Escludi id, created_at, updated_at
    return [col[0] for col in columns if col[0] not in ['id', 'created_at', 'updated_at']]

def import_json_to_db(json_file_path):
    """Importa i dati dal file JSON al database MySQL"""
    
    # Leggi il file JSON
    print(f"📖 Lettura del file {json_file_path}...")
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✓ Caricati {len(data)} record dal JSON")
    except FileNotFoundError:
        print(f"❌ File {json_file_path} non trovato!")
        return
    except json.JSONDecodeError as e:
        print(f"❌ Errore nel parsing del JSON: {e}")
        return
    
    # Connessione al database
    print("\n🔌 Connessione al database...")
    connection = get_db_connection()
    if not connection:
        return
    
    cursor = connection.cursor()
    
    # Ottieni i nomi delle colonne
    columns = get_column_names(cursor)
    print(f"✓ Trovate {len(columns)} colonne nella tabella")
    
    # Svuota la tabella (opzionale - rimuovi questo se vuoi mantenere i dati esistenti)
    print("\n🗑️  Svuotamento tabella esistente...")
    try:
        cursor.execute("TRUNCATE TABLE datasets")
        connection.commit()
        print("✓ Tabella svuotata")
    except Error as e:
        print(f"⚠️  Warning: {e}")
    
    # Prepara la query di inserimento
    placeholders = ', '.join(['%s'] * len(columns))
    column_names = ', '.join([f"`{col}`" for col in columns])
    insert_query = f"INSERT INTO datasets ({column_names}) VALUES ({placeholders})"
    
    # Inserisci i dati
    print(f"\n📥 Importazione dei dati...")
    success_count = 0
    error_count = 0
    
    for i, record in enumerate(data, 1):
        try:
            # Prepara i valori nell'ordine corretto delle colonne
            values = []
            for col in columns:
                value = record.get(col)
                
                # Converti None, array vuoti, o stringhe vuote in NULL
                if value is None or value == '' or value == [] or value == {}:
                    values.append(None)
                # Se è una lista o dizionario, converti in JSON string
                elif isinstance(value, (list, dict)):
                    values.append(json.dumps(value))
                else:
                    values.append(str(value))
            
            # Esegui l'inserimento
            cursor.execute(insert_query, values)
            success_count += 1
            
            # Mostra progresso ogni 10 record
            if i % 10 == 0:
                print(f"  Processati {i}/{len(data)} record...")
        
        except Error as e:
            error_count += 1
            print(f"  ❌ Errore nel record {i}: {e}")
            print(f"     Record: {record.get('Name', 'N/A')} - {record.get('Acronym', 'N/A')}")
    
    # Commit delle modifiche
    connection.commit()
    
    # Chiudi connessione
    cursor.close()
    connection.close()
    
    # Riepilogo
    print(f"\n" + "="*50)
    print(f"✅ Importazione completata!")
    print(f"   • Record importati con successo: {success_count}")
    print(f"   • Record con errori: {error_count}")
    print(f"   • Totale: {len(data)}")
    print("="*50)

def verify_import():
    """Verifica che i dati siano stati importati correttamente"""
    print("\n🔍 Verifica dell'importazione...")
    
    connection = get_db_connection()
    if not connection:
        return
    
    cursor = connection.cursor()
    
    # Conta i record
    cursor.execute("SELECT COUNT(*) FROM datasets")
    count = cursor.fetchone()[0]
    print(f"✓ Record totali nel database: {count}")
    
    # Mostra alcuni esempi
    cursor.execute("SELECT Name, Acronym, Country FROM datasets LIMIT 5")
    rows = cursor.fetchall()
    
    print("\n📋 Primi 5 record:")
    for row in rows:
        print(f"   • {row[0]} ({row[1]}) - {row[2]}")
    
    cursor.close()
    connection.close()

if __name__ == "__main__":
    # Percorso del file JSON (modifica secondo necessità)
    json_file = input("Inserisci il percorso del file JSON (es: data.json): ").strip()
    
    if not json_file:
        json_file = "data.json"  # Default
    
    if not os.path.exists(json_file):
        print(f"❌ File {json_file} non trovato!")
        print("\n💡 Assicurati che il file JSON sia nella stessa directory dello script")
        print("   o fornisci il percorso completo del file.")
    else:
        import_json_to_db(json_file)
        verify_import()
        
        print("\n✨ Processo completato!")
        print("\n📝 Prossimi passi:")
        print("   1. Verifica i dati nel database")
        print("   2. Avvia il server Flask: python app.py")
        print("   3. Testa l'API: http://localhost:5000/api/datasets")

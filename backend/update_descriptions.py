"""
Script per aggiornare le descrizioni (short_description) nel database
partendo dal file mapping_data.json
"""
import mysql.connector
from mysql.connector import Error
import json
import os
from dotenv import load_dotenv

# Carica variabili d'ambiente
load_dotenv()

# Configurazione database
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'lineup_mapping_data'),
    'port': int(os.getenv('DB_PORT', 3306))
}

def update_descriptions():
    """Aggiorna le descrizioni nel database dal file JSON"""
    
    print("=" * 80)
    print("🔄 AGGIORNAMENTO DESCRIZIONI NEL DATABASE")
    print("=" * 80)
    
    # Carica il file JSON
    print("\n📂 Caricamento file mapping_data.json...")
    try:
        with open('mapping_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✅ Caricati {len(data)} dataset dal JSON")
    except FileNotFoundError:
        print("❌ ERRORE: File mapping_data.json non trovato!")
        print("   Assicurati che il file sia nella stessa cartella dello script.")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ ERRORE nel parsing del JSON: {e}")
        return False
    
    # Connetti al database
    print("\n🔌 Connessione al database...")
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()
        print("✅ Connesso al database")
    except Error as e:
        print(f"❌ Errore di connessione: {e}")
        return False
    
    # Prepara le statistiche
    updated_count = 0
    skipped_count = 0
    not_found_count = 0
    
    print("\n" + "=" * 80)
    print("📝 Aggiornamento descrizioni...")
    print("=" * 80)
    
    # Per ogni dataset nel JSON
    for i, dataset in enumerate(data, 1):
        acronym = dataset.get('Acronym')
        description = dataset.get('Short Description')
        name = dataset.get('Name')
        
        if not acronym:
            print(f"\n⚠️  Dataset #{i}: Nessun acronimo trovato, skip")
            skipped_count += 1
            continue
        
        if not description or description.strip() == '':
            print(f"\n⚠️  Dataset #{i} ({acronym}): Nessuna descrizione trovata, skip")
            skipped_count += 1
            continue
        
        # Cerca il dataset nel database per acronimo
        try:
            cursor.execute("SELECT id, short_description FROM datasets WHERE acronym = %s", (acronym,))
            result = cursor.fetchone()
            
            if result:
                db_id, current_description = result
                
                # Aggiorna solo se la descrizione è vuota o diversa
                if not current_description or current_description != description:
                    cursor.execute(
                        "UPDATE datasets SET short_description = %s WHERE id = %s",
                        (description, db_id)
                    )
                    connection.commit()
                    print(f"✅ Dataset #{i} ({acronym}): Descrizione aggiornata")
                    updated_count += 1
                else:
                    print(f"ℹ️  Dataset #{i} ({acronym}): Descrizione già presente e uguale, skip")
                    skipped_count += 1
            else:
                print(f"❌ Dataset #{i} ({acronym}): NON TROVATO nel database")
                not_found_count += 1
                
        except Error as e:
            print(f"❌ Errore nell'aggiornamento di {acronym}: {e}")
    
    # Chiudi connessione
    cursor.close()
    connection.close()
    
    # Stampa riepilogo
    print("\n" + "=" * 80)
    print("📊 RIEPILOGO AGGIORNAMENTO")
    print("=" * 80)
    print(f"✅ Dataset aggiornati:        {updated_count}")
    print(f"⏭️  Dataset saltati:           {skipped_count}")
    print(f"❌ Dataset non trovati nel DB: {not_found_count}")
    print(f"📝 Totale dataset nel JSON:   {len(data)}")
    print("=" * 80)
    
    if updated_count > 0:
        print("\n✅ SUCCESSO! Le descrizioni sono state aggiornate nel database.")
        print("   Riavvia Flask per vedere le modifiche: python app.py")
    elif skipped_count == len(data):
        print("\nℹ️  Tutte le descrizioni erano già presenti e corrette.")
    else:
        print("\n⚠️  Alcuni dataset non sono stati aggiornati. Controlla i messaggi sopra.")
    
    return True

if __name__ == '__main__':
    try:
        success = update_descriptions()
        if not success:
            print("\n❌ Aggiornamento fallito!")
            exit(1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Aggiornamento interrotto dall'utente")
        exit(1)
    except Exception as e:
        print(f"\n❌ Errore imprevisto: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

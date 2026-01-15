from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

app = Flask(__name__)
CORS(app)  # Abilita CORS per permettere richieste dal frontend

# Configurazione database
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'linup_mapping_data'),
    'port': int(os.getenv('DB_PORT', 3306))
}

def get_db_connection():
    """Crea e restituisce una connessione al database"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Errore di connessione al database: {e}")
        return None

def dict_from_row(cursor, row):
    """Converte una riga del database in un dizionario"""
    if row is None:
        return None
    return dict(zip([column[0] for column in cursor.description], row))

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint per verificare che l'API sia attiva"""
    return jsonify({
        'status': 'ok',
        'message': 'API is running'
    })

@app.route('/api/datasets', methods=['GET'])
def get_all_datasets():
    """
    Restituisce tutti i dataset dal database.
    Supporta filtri opzionali tramite query parameters.
    """
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        
        # Query base
        query = "SELECT * FROM datasets"
        
        # Filtri opzionali
        filters = []
        params = []
        
        # Filtro per paese
        country = request.args.get('cntry')
        if country:
            filters.append("Country LIKE %s")
            params.append(f"%{country}%")
        
        # Filtro per acronimo
        acronym = request.args.get('acronym')
        if acronym:
            filters.append("Acronym = %s")
            params.append(acronym)
        
        # Filtro per ricerca testuale
        search = request.args.get('search')
        if search:
            # Cerca in tutti i campi testuali principali
            search_fields = [
                "Name", "Acronym", "Description", "Country",
                "`Responsible Organization(s)`", "Purpose", "Focus"
            ]
            search_conditions = " OR ".join([f"{field} LIKE %s" for field in search_fields])
            filters.append(f"({search_conditions})")
            params.extend([f"%{search}%"] * len(search_fields))
        
        # Aggiungi filtri alla query
        if filters:
            query += " WHERE " + " AND ".join(filters)
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        # Converti in lista di dizionari
        datasets = [dict_from_row(cursor, row) for row in rows]
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'success': True,
            'count': len(datasets),
            'data': datasets
        })
    
    except Error as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/datasets/<int:dataset_id>', methods=['GET'])
def get_dataset_by_id(dataset_id):
    """Restituisce un singolo dataset per ID"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM datasets WHERE id = %s", (dataset_id,))
        row = cursor.fetchone()
        
        if not row:
            return jsonify({
                'success': False,
                'error': 'Dataset not found'
            }), 404
        
        dataset = dict_from_row(cursor, row)
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'success': True,
            'data': dataset
        })
    
    except Error as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/datasets/by-acronym/<acronym>', methods=['GET'])
def get_dataset_by_acronym(acronym):
    """Restituisce un dataset cercando per acronimo"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM datasets WHERE Acronym = %s", (acronym,))
        row = cursor.fetchone()
        
        if not row:
            return jsonify({
                'success': False,
                'error': 'Dataset not found'
            }), 404
        
        dataset = dict_from_row(cursor, row)
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'success': True,
            'data': dataset
        })
    
    except Error as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/countries', methods=['GET'])
def get_countries():
    """Restituisce la lista di tutti i paesi presenti nei dataset"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute("SELECT DISTINCT Country FROM datasets WHERE Country IS NOT NULL ORDER BY Country")
        rows = cursor.fetchall()
        
        countries = [row[0] for row in rows]
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'success': True,
            'count': len(countries),
            'data': countries
        })
    
    except Error as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/datasets/by-country/<country_name>', methods=['GET'])
def get_datasets_by_country(country_name):
    """Restituisce tutti i dataset di un determinato paese"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM datasets WHERE Country LIKE %s", (f"%{country_name}%",))
        rows = cursor.fetchall()
        
        datasets = [dict_from_row(cursor, row) for row in rows]
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'success': True,
            'count': len(datasets),
            'data': datasets
        })
    
    except Error as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_statistics():
    """Restituisce statistiche generali sui dataset"""
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        
        # Conta totale dataset
        cursor.execute("SELECT COUNT(*) FROM datasets")
        total_datasets = cursor.fetchone()[0]
        
        # Conta dataset per paese
        cursor.execute("""
            SELECT Country, COUNT(*) as count 
            FROM datasets 
            WHERE Country IS NOT NULL 
            GROUP BY Country 
            ORDER BY count DESC
        """)
        countries = cursor.fetchall()
        country_counts = {row[0]: row[1] for row in countries}
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'success': True,
            'data': {
                'total_datasets': total_datasets,
                'countries_count': len(country_counts),
                'datasets_by_country': country_counts
            }
        })
    
    except Error as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    # Verifica connessione al database all'avvio
    print("Testing database connection...")
    conn = get_db_connection()
    if conn:
        print("✓ Database connection successful!")
        conn.close()
    else:
        print("✗ Database connection failed!")
    
    # Avvia il server
    app.run(
        host=os.getenv('FLASK_HOST', '0.0.0.0'),
        port=int(os.getenv('FLASK_PORT', 5000)),
        debug=os.getenv('FLASK_DEBUG', 'True') == 'True'
    )

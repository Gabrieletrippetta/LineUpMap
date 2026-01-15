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
    'database': os.getenv('DB_NAME', 'lineup_mapping_data'),
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

def transform_dataset(raw_data):
    """
    Trasforma i dati dal formato del database al formato atteso dal frontend
    """
    if not raw_data:
        return None
    
    # Combina le organizzazioni responsabili
    responsible_orgs = []
    if raw_data.get('resp_org_pub_auth'):
        responsible_orgs.append(raw_data['resp_org_pub_auth'])
    if raw_data.get('resp_org_univ_or_pub_res_ctr'):
        responsible_orgs.append(raw_data['resp_org_univ_or_pub_res_ctr'])
    if raw_data.get('resp_org_priv_org'):
        responsible_orgs.append(raw_data['resp_org_priv_org'])
    
    # Combina i gradi scolastici
    grades = []
    grade_fields = [
        'school_grd_incl_first_grade', 'school_grd_incl_second_grade',
        'school_grd_incl_third_grade', 'school_grd_incl_fourth_grade',
        'school_grd_incl_fifth_grade', 'school_grd_incl_sixth_grade',
        'school_grd_incl_seventh_grade', 'school_grd_incl_eighth_grade',
        'school_grd_incl_nineth_grade', 'school_grd_incl_tenth_grade',
        'school_grd_incl_eleventh_grade', 'school_grd_incl_twelfth_grade',
        'school_grd_incl_thirteenth_grade'
    ]
    for i, field in enumerate(grade_fields, 1):
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            grades.append(f"Grade {i}")
    
    # Combina gli scopi di raccolta dati
    purposes = []
    purpose_fields = {
        'data_coll_purp_acad_res': 'Academic Research',
        'data_coll_purp_school_sys_moneval': 'School System Monitoring/Evaluation',
        'data_coll_purp_edu_inst_moneval': 'Educational Institution Monitoring/Evaluation',
        'data_coll_purp_low_stake_indiv_asmt': 'Low-stake Individual Assessment',
        'data_coll_purp_high_stake_indiv_asmt': 'High-stake Individual Assessment'
    }
    for field, label in purpose_fields.items():
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            purposes.append(label)
    
    # Combina i focus
    focus = []
    focus_fields = {
        'data_coll_focus_school_edu': 'School Education',
        'data_coll_focus_school_to_work_trans': 'School-to-Work Transition',
        'data_coll_focus_hse_and_fam_choices': 'Household and Family Choices',
        'data_coll_focus_child_dev': 'Child Development'
    }
    for field, label in focus_fields.items():
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            focus.append(label)
    
    # Combina le competenze analizzate
    skills = []
    skill_fields = {
        'type_of_skl_anlyz_lit': 'Literacy',
        'type_of_skl_anlyz_num': 'Numeracy',
        'type_of_skl_anlyz_sci': 'Science',
        'type_of_skl_anlyz_for_lang': 'Foreign Language',
        'type_of_skl_anlyz_other_skl': 'Other Skills'
    }
    for field, label in skill_fields.items():
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            skills.append(label)
    
    # Combina i tipi di misura
    measure_types = []
    if raw_data.get('meas_type_cont_score') == 'Yes' or raw_data.get('meas_type_cont_score') == '1':
        measure_types.append('Continuous Score')
    if raw_data.get('meas_type_prof_levels') == 'Yes' or raw_data.get('meas_type_prof_levels') == '1':
        measure_types.append('Proficiency Levels')
    if raw_data.get('meas_type_not_clear') == 'Yes' or raw_data.get('meas_type_not_clear') == '1':
        measure_types.append('Not Clear')
    
    # Combina i tipi di campione
    sample_types = []
    sample_type_fields = {
        'samp_type_stud_pop': 'Student Population',
        'samp_type_rand_stud_samp': 'Random Student Sample',
        'samp_type_nonrand_stud_samp': 'Non-random Student Sample',
        'samp_type_other': 'Other'
    }
    for field, label in sample_type_fields.items():
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            sample_types.append(label)
    
    # Combina le unità campionarie
    sample_units = []
    sample_unit_fields = {
        'samp_unit_countriescities': 'Countries/Cities',
        'samp_unit_schools': 'Schools',
        'samp_unit_classes': 'Classes',
        'samp_unit_pupils': 'Pupils'
    }
    for field, label in sample_unit_fields.items():
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            sample_units.append(label)
    
    # Crea il dataset trasformato nel formato atteso dal frontend
    transformed = {
        'id': raw_data.get('id'),
        'Name': raw_data.get('name'),
        'Acronym': raw_data.get('acronym'),
        'Description': raw_data.get('short_description'),
        'Country': raw_data.get('cntry'),
        'Responsible Organization(s)': ', '.join(responsible_orgs) if responsible_orgs else None,
        'Longitudinal Data Structure': raw_data.get('long_data_struct'),
        'Type of Longitudinal Data': raw_data.get('type_of_long_data'),
        'Data Collection Frequency': raw_data.get('data_coll_freq'),
        'Starting Year': raw_data.get('starting_year'),
        'Ending Year': raw_data.get('ending_year'),
        'Sample Level': raw_data.get('samp_level'),
        'ECEC': raw_data.get('info_on_ecec_or_preprim_edu'),
        'Included Grades': ', '.join(grades) if grades else None,
        'Students followed after school education': raw_data.get('stud_foll_after_school_edu'),
        'Administration Method': raw_data.get('admin_meth'),
        'Sampling Weights/Criteria': None,  # Non presente nel DB
        'Avg Sample Size x Wave': raw_data.get('avg_samp_size_x_wave'),
        'Linkability': raw_data.get('data_link_at_indiv_level'),
        'Access to Micro Data': raw_data.get('acc_to_mic_data'),
        'Constraints': raw_data.get('constr_for_data_dwnld_and_mgmt'),
        'Website': raw_data.get('off_web'),
    }
    
    # Aggiungi Purpose con formato [bracket]
    for field, label in purpose_fields.items():
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            transformed[f'Data Collection Purpose [{label}]'] = 'Yes'
    
    # Aggiungi Focus con formato [bracket]
    for field, label in focus_fields.items():
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            transformed[f'Data Collection Focus [{label}]'] = 'Yes'
    
    # Aggiungi Skills con formato [bracket]
    for field, label in skill_fields.items():
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            transformed[f'Type of Skills Analysed [{label}]'] = 'Yes'
    
    # Aggiungi Measure Types con formato [bracket]
    if raw_data.get('meas_type_cont_score') == 'Yes' or raw_data.get('meas_type_cont_score') == '1':
        transformed['Measure Type [Continuous Score]'] = 'Yes'
    if raw_data.get('meas_type_prof_levels') == 'Yes' or raw_data.get('meas_type_prof_levels') == '1':
        transformed['Measure Type [Proficiency Levels]'] = 'Yes'
    if raw_data.get('meas_type_not_clear') == 'Yes' or raw_data.get('meas_type_not_clear') == '1':
        transformed['Measure Type [Not Clear]'] = 'Yes'
    
    # Aggiungi Sample Types con formato [bracket]
    for field, label in sample_type_fields.items():
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            transformed[f'Sample Type [{label}]'] = 'Yes'
    
    # Aggiungi Sample Units con formato [bracket]
    for field, label in sample_unit_fields.items():
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            transformed[f'Sample Unit [{label}]'] = 'Yes'
    
    # Aggiungi Grades con formato [bracket]
    grade_labels = [
        'First Grade', 'Second Grade', 'Third Grade', 'Fourth Grade',
        'Fifth Grade', 'Sixth Grade', 'Seventh Grade', 'Eighth Grade',
        'Nineth Grade', 'Tenth Grade', 'Eleventh Grade', 'Twelfth Grade',
        'Thirteenth Grade'
    ]
    for i, field in enumerate(grade_fields, 0):
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            transformed[f'School Grades Included [{grade_labels[i]}]'] = 'Yes'
    
    return transformed

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
        country = request.args.get('country')
        if country:
            filters.append("cntry LIKE %s")
            params.append(f"%{country}%")
        
        # Filtro per acronimo
        acronym = request.args.get('acronym')
        if acronym:
            filters.append("acronym = %s")
            params.append(acronym)
        
        # Filtro per ricerca testuale
        search = request.args.get('search')
        if search:
            search_fields = ["name", "acronym", "short_description", "cntry"]
            search_conditions = " OR ".join([f"{field} LIKE %s" for field in search_fields])
            filters.append(f"({search_conditions})")
            params.extend([f"%{search}%"] * len(search_fields))
        
        # Aggiungi filtri alla query
        if filters:
            query += " WHERE " + " AND ".join(filters)
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        # Converti in lista di dizionari e trasforma
        raw_datasets = [dict_from_row(cursor, row) for row in rows]
        datasets = [transform_dataset(ds) for ds in raw_datasets]
        
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
        
        raw_dataset = dict_from_row(cursor, row)
        dataset = transform_dataset(raw_dataset)
        
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
        cursor.execute("SELECT * FROM datasets WHERE acronym = %s", (acronym,))
        row = cursor.fetchone()
        
        if not row:
            return jsonify({
                'success': False,
                'error': 'Dataset not found'
            }), 404
        
        raw_dataset = dict_from_row(cursor, row)
        dataset = transform_dataset(raw_dataset)
        
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
        cursor.execute("SELECT DISTINCT cntry FROM datasets WHERE cntry IS NOT NULL ORDER BY cntry")
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
        cursor.execute("SELECT * FROM datasets WHERE cntry LIKE %s", (f"%{country_name}%",))
        rows = cursor.fetchall()
        
        raw_datasets = [dict_from_row(cursor, row) for row in rows]
        datasets = [transform_dataset(ds) for ds in raw_datasets]
        
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
            SELECT cntry, COUNT(*) as count 
            FROM datasets 
            WHERE cntry IS NOT NULL 
            GROUP BY cntry 
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
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM datasets")
        count = cursor.fetchone()[0]
        print(f"✓ Found {count} datasets in database")
        cursor.close()
        conn.close()
    else:
        print("✗ Database connection failed!")
    
    # Avvia il server
    app.run(
        host=os.getenv('FLASK_HOST', '0.0.0.0'),
        port=int(os.getenv('FLASK_PORT', 5000)),
        debug=os.getenv('FLASK_DEBUG', 'True') == 'True'
    )

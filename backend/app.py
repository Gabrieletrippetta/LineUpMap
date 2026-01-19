from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from config import config
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

app = Flask(__name__, static_folder='../frontend', static_url_path='')

# Carica configurazione per admin
env = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config[env])

CORS(app)  # Abilita CORS per permettere richieste dal frontend

# ============== FRONTEND ROUTES ==============
@app.route('/')
def serve_index():
    """Servi il file index.html del frontend"""
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    """Servi i file statici del frontend (CSS, JS, immagini, ecc.)"""
    try:
        return send_from_directory('../frontend', path)
    except:
        # Se il file non esiste, ritorna 404
        return jsonify({'error': 'File not found'}), 404

# ============== API HEALTH CHECK ==============
@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint per verificare che l'API sia attiva"""
    return jsonify({
        'status': 'ok',
        'message': 'API is running'
    })

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
    
    # Combina i gradi scolastici
    grades = []
    grade_fields = [
        'school_grd_incl_first_grade', 'school_grd_incl_second_grade',
        'school_grd_incl_third_grade', 'school_grd_incl_fourth_grade',
        'school_grd_incl_fifth_grade', 'school_grd_incl_sixth_grade',
        'school_grd_incl_seventh_grade', 'school_grd_incl_eighth_grade',
        'school_grd_incl_ninth_grade', 'school_grd_incl_tenth_grade',
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
        'Short Description': raw_data.get('short_description'),
        'Country': raw_data.get('cntry'),
        'Longitudinal Data Structure': raw_data.get('long_data_struct'),
        'Type of Longitudinal Data': raw_data.get('type_of_long_data'),
        'Data Collection Frequency': raw_data.get('data_coll_freq').replace('Every four year or more', 'Every four years or more') if raw_data.get('data_coll_freq') else None,
        'Starting Year': raw_data.get('starting_year'),
        'Ending Year': raw_data.get('ending_year'),
        'Sample Level': raw_data.get('samp_level'),
        'Information on ECEC or Pre-Primary Education': raw_data.get('info_on_ecec_or_preprim_edu'),
        'Included Grades': ', '.join(grades) if grades else None,
        'Students Followed After School Education': raw_data.get('stud_foll_after_school_edu'),
        'Administration Method': raw_data.get('admin_meth'),
        'Sampling Weights/Criteria': None,  # Non presente nel DB
        'Average Sample Size x Wave': raw_data.get('avg_samp_size_x_wave'),
        'Data Linkability At Individual Level': raw_data.get('data_link_at_indiv_level'),
        'Access to Micro Data': raw_data.get('acc_to_mic_data'),
        'Constraints for Data Download and Management': raw_data.get('constr_for_data_dwnld_and_mgmt'),
        'Official Website': raw_data.get('off_web'),
    }
    
    # Aggiungi Responsible Organization con formato [bracket]
    if raw_data.get('resp_org_pub_auth') == 'Yes' or raw_data.get('resp_org_pub_auth') == '1':
        transformed['Responsible Organization [Public Authority]'] = 'Yes'
    if raw_data.get('resp_org_univ_or_pub_res_ctr') == 'Yes' or raw_data.get('resp_org_univ_or_pub_res_ctr') == '1':
        transformed['Responsible Organization [University or Public Research Centre]'] = 'Yes'
    if raw_data.get('resp_org_priv_org') == 'Yes' or raw_data.get('resp_org_priv_org') == '1':
        transformed['Responsible Organization [Private Organization]'] = 'Yes'
    
    # Aggiungi Data Linkability At Individual Level con formato [bracket]
    if raw_data.get('data_link_at_indiv_level_stud_quest') == 'Yes' or raw_data.get('data_link_at_indiv_level_stud_quest') == '1':
        transformed["Data Linkability At Individual Level [Students' Questionnaire]"] = 'Yes'
    if raw_data.get('data_link_at_indiv_level_stud_test') == 'Yes' or raw_data.get('data_link_at_indiv_level_stud_test') == '1':
        transformed["Data Linkability At Individual Level [Students' Test]"] = 'Yes'
    if raw_data.get('data_link_at_indiv_level_school_quest') == 'Yes' or raw_data.get('data_link_at_indiv_level_school_quest') == '1':
        transformed["Data Linkability At Individual Level [School Questionnaire]"] = 'Yes'
    if raw_data.get('data_link_at_indiv_level_heads_quest') == 'Yes' or raw_data.get('data_link_at_indiv_level_heads_quest') == '1':
        transformed["Data Linkability At Individual Level [Headmaster's Questionnaire]"] = 'Yes'
    if raw_data.get('data_link_at_indiv_level_teach_quest') == 'Yes' or raw_data.get('data_link_at_indiv_level_teach_quest') == '1':
        transformed["Data Linkability At Individual Level [Teachers' Questionnaire]"] = 'Yes'
    if raw_data.get('data_link_at_indiv_level_par_quest') == 'Yes' or raw_data.get('data_link_at_indiv_level_par_quest') == '1':
        transformed["Data Linkability At Individual Level [Parents' Questionnaire]"] = 'Yes'
    
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
        'Ninth Grade', 'Tenth Grade', 'Eleventh Grade', 'Twelfth Grade',
        'Thirteenth Grade'
    ]
    for i, field in enumerate(grade_fields, 0):
        if raw_data.get(field) == 'Yes' or raw_data.get(field) == '1':
            transformed[f'School Grades Included [{grade_labels[i]}]'] = 'Yes'
    
    # ============================================================================
    # DATA VARIABLES - Mapping dei campi dal database ai nomi del frontend
    # ============================================================================
    
    # Helper function to add non-empty values
    def add_if_present(db_field, frontend_field):
        value = raw_data.get(db_field)
        if value and value not in ['N/A', '-', 'null', '']:
            transformed[frontend_field] = value
    
    # STUDENT INFORMATION (14 campi)
    add_if_present('st_gender', 'Student Gender')
    add_if_present('st_age', 'Student Age')
    add_if_present('st_citizen', 'Student Citizenship')
    add_if_present('st_for_brth_cntry', 'Student Foreign Birth Country')
    add_if_present('st_spec_brth_cntry', 'Student Specific Birth Country')
    add_if_present('st_town_of_resid', 'Student Town of Residence')
    add_if_present('st_prov_of_resid', 'Student Province of Residence')
    add_if_present('st_reg_of_resid', 'Student Region of Residence')
    add_if_present('st_prev_grade_retent', 'Student Previous Grade Retention')
    add_if_present('st_learn_impair', 'Student Learning Impairments')
    add_if_present('st_phys_impair', 'Student Physical Impairments')
    add_if_present('st_school_attit_or_motiv', 'Student School Attitude or Motivation')
    add_if_present('st_assgn_teach_grd', 'Student Assigned Teacher Grades')
    add_if_present('st_allowschlr', 'Student Allowance/Scholarship')
    
    # HOUSEHOLD INFORMATION (13 campi)
    add_if_present('num_of_par', 'Number of Parents')
    add_if_present('pres_of_steppar', 'Presence of Stepparents')
    add_if_present('sibl', 'Siblings')
    add_if_present('paral_work_stat', 'Parental Working Status')
    add_if_present('paral_occup', 'Parental Occupation')
    add_if_present('paral_edu', 'Parental Education')
    add_if_present('paral_edu_level_iscd', 'Parental Education Level (ISCED)')
    add_if_present('paral_migr_bg', 'Parental Migratory Background')
    add_if_present('par_age', 'Parents Age')
    add_if_present('paral_inc_or_wlth', 'Parental Income or Wealth')
    add_if_present('num_of_bks', 'Number of Books')
    add_if_present('num_of_dgtl_dev', 'Number of Digital Devices')
    add_if_present('own_of_the_apthse', 'Ownership of the Apartment/House')
    
    # TEACHER INFORMATION (5 campi)
    add_if_present('teach_age', 'Teacher Age')
    add_if_present('teach_gender', 'Teacher Gender')
    add_if_present('teach_senior', 'Teacher Seniority')
    add_if_present('teach_edu_deg', 'Teacher Educational Degree')
    add_if_present('teach_contr_type', 'Teacher Contract Type')
    
    # SCHOOL/CLASS INFORMATION (4 campi)
    add_if_present('school_size', 'School Size')
    add_if_present('class_size', 'Class Size')
    add_if_present('school_comp', 'School Composition')
    add_if_present('class_comp', 'Class Composition')
    
    return transformed

# Registra il blueprint admin
from admin import admin_bp
app.register_blueprint(admin_bp)


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

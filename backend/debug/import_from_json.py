#!/usr/bin/env python3
"""
Import Data from JSON to Database
Importa tutti i 103 dataset dal file mapping_data.json nel database MySQL
VERSIONE CORRETTA con mappatura basata sulle colonne reali del database
"""

import json
import mysql.connector
from mysql.connector import Error
import sys

# ============================================================================
# CONFIGURAZIONE - MODIFICA QUESTI VALORI
# ============================================================================

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'nuova_password',
    'database': 'lineup_mapping_data',
    'port': 3306
}

JSON_FILE = 'mapping_data.json'

# ============================================================================
# MAPPATURA CAMPI JSON → DATABASE (CORRETTA!)
# ============================================================================

FIELD_MAPPING = {
    # Basic Information
    'Country': 'cntry',
    'Name': 'name',
    'Acronym': 'acronym',
    'Short Description': 'short_description',
    
    # Responsible Organization
    'Responsible Organization [Public Authority]': 'resp_org_pub_auth',
    'Responsible Organization [University or Public Research Centre]': 'resp_org_univ_or_pub_res_ctr',
    'Responsible Organization [Private Organization]': 'resp_org_priv_org',
    
    # Data Structure
    'Longitudinal Data Structure': 'long_data_struct',
    'Type of Longitudinal Data': 'type_of_long_data',
    'Data Collection Frequency ': 'data_coll_freq',
    'Starting Year': 'starting_year',
    'Ending Year': 'ending_year',
    'Sample Level': 'samp_level',
    
    # Data Collection Purpose
    'Data Collection Purpose [Academic Research]': 'data_coll_purp_acad_res',
    'Data Collection Purpose [School System Monitoring/Evaluation]': 'data_coll_purp_school_sys_moneval',
    'Data Collection Purpose [Educational Institutions Monitoring/Evaluation]': 'data_coll_purp_edu_inst_moneval',
    'Data Collection Purpose [Low Stake Individuals\' Assessment]': 'data_coll_purp_low_stake_indiv_asmt',
    'Data Collection Purpose [High Stake Individuals\' Assessment]': 'data_coll_purp_high_stake_indiv_asmt',
    
    # Data Collection Focus
    'Data Collection Focus [School Education]': 'data_coll_focus_school_edu',
    'Data Collection Focus [School To Work Transition]': 'data_coll_focus_school_to_work_trans',
    'Data Collection Focus [Household and Family Choices]': 'data_coll_focus_hse_and_fam_choices',
    'Data Collection Focus [Child Development]': 'data_coll_focus_child_dev',
    
    # School Grades
    'School Grades Included [First Grade]': 'school_grd_incl_first_grade',
    'School Grades Included [Second Grade]': 'school_grd_incl_second_grade',
    'School Grades Included [Third Grade]': 'school_grd_incl_third_grade',
    'School Grades Included [Fourth Grade]': 'school_grd_incl_fourth_grade',
    'School Grades Included [Fifth Grade]': 'school_grd_incl_fifth_grade',
    'School Grades Included [Sixth Grade]': 'school_grd_incl_sixth_grade',
    'School Grades Included [Seventh Grade]': 'school_grd_incl_seventh_grade',
    'School Grades Included [Eighth Grade]': 'school_grd_incl_eighth_grade',
    'School Grades Included [ninth Grade]': 'school_grd_incl_ninth_grade',
    'School Grades Included [Tenth Grade]': 'school_grd_incl_tenth_grade',
    'School Grades Included [Eleventh Grade]': 'school_grd_incl_eleventh_grade',
    'School Grades Included [Twelfth Grade]': 'school_grd_incl_twelfth_grade',
    'School Grades Included [Thirteenth Grade]': 'school_grd_incl_thirteenth_grade',
    
    # ECEC and Follow-up
    'Information on ECEC or Pre-Primary Education': 'info_on_ecec_or_preprim_edu',
    'Students Followed After School Education': 'stud_foll_after_school_edu',
    
    # Skills Analysed
    'Type of Skills Analysed [Literacy]': 'type_of_skl_anlyz_lit',
    'Type of Skills Analysed [Numeracy]': 'type_of_skl_anlyz_num',
    'Type of Skills Analysed [Science]': 'type_of_skl_anlyz_sci',
    'Type of Skills Analysed [Foreign Language]': 'type_of_skl_anlyz_for_lang',
    'Type of Skills Analysed [Other skills]': 'type_of_skl_anlyz_other_skl',
    
    # Measure Type
    'Measure Type [Continuous score]': 'meas_type_cont_score',
    'Measure Type [Proficiency levels]': 'meas_type_prof_levels',
    'Measure Type [Not clear]': 'meas_type_not_clear',
    
    # Administration
    'Administration Method ': 'admin_meth',
    
    # Sample Type
    'Sample Type [Students\' Population]': 'samp_type_stud_pop',
    'Sample Type [Random Students\' Sample]': 'samp_type_rand_stud_samp',
    'Sample Type [Non-Random Students\' Sample]': 'samp_type_nonrand_stud_samp',
    'Sample Type [Other]': 'samp_type_other',
    
    # Sample info
    'Average Sample Size x Wave': 'avg_samp_size_x_wave',
    
    # Sample Unit
    'Sample Unit [Countries/Cities]': 'samp_unit_countriescities',
    'Sample Unit [Schools]': 'samp_unit_schools',
    'Sample Unit [Classes]': 'samp_unit_classes',
    'Sample Unit [Pupils]': 'samp_unit_pupils',
    
    # Data Linkability
    'Data Linkability at Individual Level ': 'data_link_at_indiv_level',
    'Data Linkability At Individual Level [Students\' Questionnaire]': 'data_link_at_indiv_level_stud_quest',
    'Data Linkability At Individual Level [Students\' Test]': 'data_link_at_indiv_level_stud_test',
    'Data Linkability At Individual Level  [School Questionnaire]': 'data_link_at_indiv_level_school_quest',
    'Data Linkability At Individual Level  [Headmaster\'s Questionnaire]': 'data_link_at_indiv_level_heads_quest',
    'Data Linkability At Individual Level  [Teachers\' Questionnaire]': 'data_link_at_indiv_level_teach_quest',
    'Data Linkability At Individual Level  [Parents\' Questionnaire]': 'data_link_at_indiv_level_par_quest',
    
    # Access
    'Access to Micro Data': 'acc_to_mic_data',
    'Constraints for Data Download and Management': 'constr_for_data_dwnld_and_mgmt',
    'Official Website': 'off_web',
    
    # Student's Information
    'Student Gender': 'st_gender',
    'Student Age': 'st_age',
    'Student Citizenship': 'st_citizen',
    'Student Foreign Birth Country': 'st_for_brth_cntry',
    'Student Specific Birth Country': 'st_spec_brth_cntry',
    'Student Town of Residence': 'st_town_of_resid',
    'Student Province of Residence': 'st_prov_of_resid',
    'Student Region of Residence': 'st_reg_of_resid',
    'Student Belonging to a Recognised Ethnic Minority': 'st_belong_to_a_recog_ethn_min',
    'Student ECEC Attendance ': 'st_ecec_attnd',
    'Student Previous Grade Retention': 'st_prev_grade_retent',
    'Student Learning Impairments': 'st_learn_impair',
    'Student Physical Impairments': 'st_phys_impair',
    'Student School Attitude or Motivation': 'st_school_attit_or_motiv',
    'Student Assigned Teacher Grades': 'st_assgn_teach_grd',
    'Student Allowance/Scholarship': 'st_allowschlr',
    'Student Information Type': 'st_info_type',
    
    # Household's Information
    'Number of Parents': 'num_of_par',
    'Presence of Stepparents': 'pres_of_steppar',
    'Siblings': 'sibl',
    'Parental Working Status': 'paral_work_stat',
    'Parental Occupation': 'paral_occup',
    'Parental Education': 'paral_edu',
    'Parental Education Level (ISCED)': 'paral_edu_level_iscd',
    'Parental Migratory Background': 'paral_migr_bg',
    'Parents Age': 'par_age',
    'Parents Place Of Birth': 'par_plc_of_brth',
    'Parental Income or Wealth': 'paral_inc_or_wlth',
    'Parental Host Country\'s Language Proficiency': 'paral_host_cntrys_lang_prof',
    'Number of Books': 'num_of_bks',
    'Number of Digital Devices': 'num_of_dgtl_dev',
    'Ownership of the Apartment/House': 'own_of_the_apthse',
    'Household Information Type': 'hse_info_type',
    
    # Teachers' Information
    'Teacher Age': 'teach_age',
    'Teacher Gender': 'teach_gender',
    'Teacher Seniority': 'teach_senior',
    'Teacher Educational Degree': 'teach_edu_deg',
    'Teacher Contract Type': 'teach_contr_type',
    'Teacher Information Type': 'teach_info_type',
    'Teacher Information Linkability': 'teach_info_link',
    
    # School/Class Information
    'School Geo-Referencing': 'school_geo',
    'School Type ': 'school_type',
    'School Track ': 'school_track',
    'School Size': 'school_size',
    'Class Size': 'class_size',
    'School Composition': 'school_comp',
    'Class Composition': 'class_comp',
}

# ============================================================================
# FUNZIONI
# ============================================================================

def normalize_value(value):
    """
    Normalizza i valori dal JSON al formato database
    """
    if value is None:
        return None
    
    # Converti a stringa per confronti
    str_value = str(value).strip()
    
    # Gestisci valori vuoti
    if str_value == '' or str_value.upper() == 'N/A':
        return None
    
    # Normalizza Yes/No
    if str_value in ['Yes', 'YES', 'yes']:
        return 'Yes'
    elif str_value in ['No', 'NO', 'no']:
        return 'No'
    elif str_value in ['Not clear', 'not clear', 'NOT CLEAR', 'Not Clear']:
        return 'Not clear'
    
    # Mantieni "ongoing" come valore valido
    if str_value.lower() == 'ongoing':
        return 'ongoing'
    
    # Ritorna il valore così com'è per altri campi
    return value

def load_json_data(filename):
    """Carica i dati dal file JSON"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        print(f"❌ Errore: File {filename} non trovato!")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Errore nel parsing JSON: {e}")
        sys.exit(1)

def find_dataset_by_acronym(cursor, acronym):
    """Trova un dataset nel database tramite l'acronimo"""
    query = "SELECT id FROM datasets WHERE acronym = %s"
    cursor.execute(query, (acronym,))
    result = cursor.fetchone()
    return result['id'] if result else None

def update_dataset(conn, cursor, dataset_id, json_record):
    """Aggiorna un singolo dataset con i dati dal JSON"""
    set_clauses = []
    values = []
    
    # Mappa i campi dal JSON al database
    for json_field, db_field in FIELD_MAPPING.items():
        if json_field in json_record:
            normalized_value = normalize_value(json_record[json_field])
            set_clauses.append(f"`{db_field}` = %s")
            values.append(normalized_value)
    
    if not set_clauses:
        return False, "Nessun campo da aggiornare"
    
    values.append(dataset_id)
    query = f"UPDATE datasets SET {', '.join(set_clauses)} WHERE id = %s"
    
    try:
        cursor.execute(query, values)
        conn.commit()
        return True, "OK"
    except Error as e:
        return False, str(e)

def import_json_to_database():
    """Importa tutti i dati dal JSON al database"""
    print("\n" + "="*80)
    print("  📥 Import JSON to Database - LINEup Education Data Explorer")
    print("="*80 + "\n")
    
    # Carica JSON
    print("📄 Caricamento file JSON...")
    json_data = load_json_data(JSON_FILE)
    print(f"✅ Caricati {len(json_data)} dataset dal JSON\n")
    
    # Connetti al database
    print("🔌 Connessione al database...")
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        print(f"✅ Connesso a {DB_CONFIG['database']}@{DB_CONFIG['host']}\n")
    except Error as e:
        print(f"❌ Errore di connessione: {e}")
        sys.exit(1)
    
    # Processa ogni dataset
    print("🔄 Inizio import...\n")
    updated = 0
    not_found = 0
    errors = 0
    
    for i, record in enumerate(json_data, 1):
        acronym = record.get('Acronym', 'N/A')
        name = record.get('Name', 'N/A')[:50]
        
        # Trova il dataset nel database tramite acronimo
        dataset_id = find_dataset_by_acronym(cursor, acronym)
        
        if dataset_id is None:
            print(f"⚠️  [{i:3d}/103] {acronym:20s} - Dataset non trovato nel DB")
            not_found += 1
            continue
        
        # Aggiorna il dataset
        success, message = update_dataset(conn, cursor, dataset_id, record)
        
        if success:
            print(f"✅ [{i:3d}/103] {acronym:20s} - Aggiornato (ID: {dataset_id})")
            updated += 1
        else:
            print(f"❌ [{i:3d}/103] {acronym:20s} - Errore: {message}")
            errors += 1
        
        # Progress update ogni 10 dataset
        if i % 10 == 0:
            print(f"   ... Processati {i}/103 dataset")
    
    cursor.close()
    conn.close()
    
    # Riepilogo
    print("\n" + "="*80)
    print("  ✅ Import Completato!")
    print("="*80 + "\n")
    print(f"📊 Statistiche:")
    print(f"   Dataset aggiornati:    {updated:3d}")
    print(f"   Dataset non trovati:   {not_found:3d}")
    print(f"   Errori:                {errors:3d}")
    print(f"   Totale processati:     {len(json_data):3d}")
    print()
    
    if not_found > 0:
        print("⚠️  ATTENZIONE: Alcuni dataset non sono stati trovati nel database.")
        print("   Verifica che gli acronimi nel JSON corrispondano a quelli nel DB.")
        print()
    
    if errors > 0:
        print("❌ Ci sono stati degli errori durante l'import.")
        print("   Controlla i log sopra per i dettagli.")
        print()
    
    if updated == len(json_data) - not_found:
        print("🎉 Perfetto! Tutti i dataset trovati sono stati aggiornati con successo!")
        print()
        print("📝 Prossimi passi:")
        print("   1. Apri l'applicazione Flask")
        print("   2. Vai su un dataset in modalità edit")
        print("   3. Verifica che tutti i campi siano popolati correttamente")
        print()

# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("\n⚙️  Configurazione:")
    print(f"   Database: {DB_CONFIG['database']}")
    print(f"   Host: {DB_CONFIG['host']}")
    print(f"   File JSON: {JSON_FILE}")
    print(f"   Campi mappati: {len(FIELD_MAPPING)}")
    print()
    
    response = input("👉 Vuoi procedere con l'import? (yes/no): ")
    if response.lower() != 'yes':
        print("❌ Operazione annullata.")
        sys.exit(0)
    
    import_json_to_database()
    
    print("="*80)
    print("✅ Script terminato!")
    print("="*80 + "\n")

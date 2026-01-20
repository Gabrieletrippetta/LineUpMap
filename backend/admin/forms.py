"""
Definizioni delle opzioni per i form
Questo file contiene tutte le opzioni disponibili per i select nei form
"""

# Campi obbligatori
REQUIRED_FIELDS = [
    'name',
    'acronym', 
    'cntry',
    'long_data_struct',
    'starting_year'
]

# Campi obbligatori per Dataset Variables (tutte le variabili devono essere specificate)
REQUIRED_VARIABLE_FIELDS = [
    # Student's Information
    'st_gender', 'st_age', 'st_citizen', 'st_for_brth_cntry',
    'st_spec_brth_cntry', 'st_town_of_resid', 'st_prov_of_resid', 'st_reg_of_resid',
    'st_belong_to_a_recog_ethn_min', 'st_ecec_attnd', 'st_prev_grade_retent', 'st_learn_impair',
    'st_phys_impair', 'st_school_attit_or_motiv', 'st_assgn_teach_grd', 'st_allowschlr', 'st_info_type',
    # Household's Information
    'num_of_par', 'pres_of_steppar', 'sibl', 'paral_work_stat', 'paral_occup', 'paral_edu',
    'paral_edu_level_iscd', 'paral_migr_bg', 'par_age', 'par_plc_of_brth',
    'paral_inc_or_wlth', 'paral_host_cntrys_lang_prof', 'num_of_bks', 'num_of_dgtl_dev',
    'own_of_the_apthse', 'hse_info_type',
    # Teachers' Information
    'teach_age', 'teach_gender', 'teach_senior', 'teach_edu_deg', 'teach_contr_type', 'teach_info_type', 'teach_info_link',
    # School/Class Information
    'school_geo', 'school_type', 'school_track', 'school_size', 'class_size',
    'school_comp', 'class_comp'
]

# Opzioni per i select dropdown (campi singoli)
FORM_OPTIONS = {
    'long_data_struct': [
        'Panel',
        'Cohort',
        'Repeated Cross-Sectional',
        'Other'
    ],
    
    'type_of_long_data': [
        'Prospective',
        'Retrospective',
        'Both',
        'Not clear'
    ],
    
    'data_coll_freq': [
        'Annual',
        'Biennial',
        'Every 3 years',
        'Every 4 years',
        'Every 5 years',
        'Every four years or more',
        'Irregular',
        'One-off',
        'Other'
    ],
    
    'samp_level': [
        'National',
        'Limited to specific regions/areas',
        'Other'
    ],
    
    'info_on_ecec_or_preprim_edu': [
        'Yes',
        'No',
        'Not clear'
    ],
    
    'stud_foll_after_school_edu': [
        'Yes',
        'No',
        'Not clear'
    ],
    
    'admin_meth': [
        'Paper-based',
        'Computer-based',
        'Both',
        'Other',
        'Not clear'
    ],
    
    'data_link_at_indiv_level': [
        'Yes',
        'No',
        'Partially',
        'Not clear'
    ],
    
    'acc_to_mic_data': [
        'Yes, freely available',
        'Yes, upon request',
        'Yes, with restrictions',
        'No',
        'Not clear'
    ],
    
    'constr_for_data_dwnld_and_mgmt': [
        'No constraints',
        'Registration required',
        'Application/proposal required',
        'Fee required',
        'Data use agreement required',
        'On-site access only',
        'Multiple constraints',
        'Other',
        'Not clear'
    ]
}

# Paesi europei disponibili
COUNTRIES = [
    'AT (Austria)',
    'BE (Flanders)',
    'BE (Wallonia)',
    'BG (Bulgaria)',
    'HR (Croatia)',
    'CY (Cyprus)',
    'CZ (Czech Republic)',
    'DK (Denmark)',
    'EE (Estonia)',
    'FI (Finland)',
    'FR (France)',
    'DE (Germany)',
    'GR (Greece)',
    'HU (Hungary)',
    'IS (Iceland)',
    'IE (Ireland)',
    'IT (Italy)',
    'LV (Latvia)',
    'LI (Liechtenstein)',
    'LT (Lithuania)',
    'LU (Luxembourg)',
    'MT (Malta)',
    'NL (Netherlands)',
    'NO (Norway)',
    'PL (Poland)',
    'PT (Portugal)',
    'RO (Romania)',
    'SK (Slovakia)',
    'SI (Slovenia)',
    'ES (Spain)',
    'SE (Sweden)',
    'CH (Switzerland)',
    'UK (United Kingdom)'
]

# Campi Yes/No per Responsible Organizations
RESPONSIBLE_ORG_FIELDS = [
    'resp_org_pub_auth',
    'resp_org_univ_or_pub_res_ctr',
    'resp_org_priv_org'
]

RESPONSIBLE_ORG_LABELS = {
    'resp_org_pub_auth': 'Public Authority',
    'resp_org_univ_or_pub_res_ctr': 'University or Public Research Centre',
    'resp_org_priv_org': 'Private Organization'
}

# Campi Yes/No per Data Collection Purpose
DATA_COLL_PURPOSE_FIELDS = [
    'data_coll_purp_acad_res',
    'data_coll_purp_school_sys_moneval',
    'data_coll_purp_edu_inst_moneval',
    'data_coll_purp_low_stake_indiv_asmt',
    'data_coll_purp_high_stake_indiv_asmt'
]

DATA_COLL_PURPOSE_LABELS = {
    'data_coll_purp_acad_res': 'Academic Research',
    'data_coll_purp_school_sys_moneval': 'School System Monitoring/Evaluation',
    'data_coll_purp_edu_inst_moneval': 'Educational Institution Monitoring/Evaluation',
    'data_coll_purp_low_stake_indiv_asmt': 'Low-stake Individual Assessment',
    'data_coll_purp_high_stake_indiv_asmt': 'High-stake Individual Assessment'
}

# Campi Yes/No per Data Collection Focus
DATA_COLL_FOCUS_FIELDS = [
    'data_coll_focus_school_edu',
    'data_coll_focus_school_to_work_trans',
    'data_coll_focus_hse_and_fam_choices',
    'data_coll_focus_child_dev'
]

DATA_COLL_FOCUS_LABELS = {
    'data_coll_focus_school_edu': 'School Education',
    'data_coll_focus_school_to_work_trans': 'School-to-Work Transition',
    'data_coll_focus_hse_and_fam_choices': 'Household and Family Choices',
    'data_coll_focus_child_dev': 'Child Development'
}

# Campi Yes/No per School Grades
SCHOOL_GRADES_FIELDS = [
    'school_grd_incl_first_grade',
    'school_grd_incl_second_grade',
    'school_grd_incl_third_grade',
    'school_grd_incl_fourth_grade',
    'school_grd_incl_fifth_grade',
    'school_grd_incl_sixth_grade',
    'school_grd_incl_seventh_grade',
    'school_grd_incl_eighth_grade',
    'school_grd_incl_ninth_grade',
    'school_grd_incl_tenth_grade',
    'school_grd_incl_eleventh_grade',
    'school_grd_incl_twelfth_grade',
    'school_grd_incl_thirteenth_grade'
]

SCHOOL_GRADES_LABELS = {
    'school_grd_incl_first_grade': 'Grade 1',
    'school_grd_incl_second_grade': 'Grade 2',
    'school_grd_incl_third_grade': 'Grade 3',
    'school_grd_incl_fourth_grade': 'Grade 4',
    'school_grd_incl_fifth_grade': 'Grade 5',
    'school_grd_incl_sixth_grade': 'Grade 6',
    'school_grd_incl_seventh_grade': 'Grade 7',
    'school_grd_incl_eighth_grade': 'Grade 8',
    'school_grd_incl_ninth_grade': 'Grade 9',
    'school_grd_incl_tenth_grade': 'Grade 10',
    'school_grd_incl_eleventh_grade': 'Grade 11',
    'school_grd_incl_twelfth_grade': 'Grade 12',
    'school_grd_incl_thirteenth_grade': 'Grade 13'
}

# Campi Yes/No per Skills Analyzed
SKILLS_ANALYZED_FIELDS = [
    'type_of_skl_anlyz_lit',
    'type_of_skl_anlyz_num',
    'type_of_skl_anlyz_sci',
    'type_of_skl_anlyz_for_lang',
    'type_of_skl_anlyz_other_skl'
]

SKILLS_ANALYZED_LABELS = {
    'type_of_skl_anlyz_lit': 'Literacy',
    'type_of_skl_anlyz_num': 'Numeracy',
    'type_of_skl_anlyz_sci': 'Science',
    'type_of_skl_anlyz_for_lang': 'Foreign Language',
    'type_of_skl_anlyz_other_skl': 'Other Skills'
}

# Campi Yes/No per Measure Types
MEASURE_TYPE_FIELDS = [
    'meas_type_cont_score',
    'meas_type_prof_levels',
    'meas_type_not_clear'
]

MEASURE_TYPE_LABELS = {
    'meas_type_cont_score': 'Continuous Score',
    'meas_type_prof_levels': 'Proficiency Levels',
    'meas_type_not_clear': 'Not Clear'
}

# Campi Yes/No per Sample Types
SAMPLE_TYPE_FIELDS = [
    'samp_type_stud_pop',
    'samp_type_rand_stud_samp',
    'samp_type_nonrand_stud_samp',
    'samp_type_other'
]

SAMPLE_TYPE_LABELS = {
    'samp_type_stud_pop': 'Student Population',
    'samp_type_rand_stud_samp': 'Random Student Sample',
    'samp_type_nonrand_stud_samp': 'Non-random Student Sample',
    'samp_type_other': 'Other'
}

# Campi Yes/No per Sample Units
SAMPLE_UNIT_FIELDS = [
    'samp_unit_countriescities',
    'samp_unit_schools',
    'samp_unit_classes',
    'samp_unit_pupils'
]

SAMPLE_UNIT_LABELS = {
    'samp_unit_countriescities': 'Countries/Cities',
    'samp_unit_schools': 'Schools',
    'samp_unit_classes': 'Classes',
    'samp_unit_pupils': 'Pupils'
}

# Campi Yes/No per Data Linkability
DATA_LINKABILITY_FIELDS = [
    'data_link_at_indiv_level_stud_quest',
    'data_link_at_indiv_level_stud_test',
    'data_link_at_indiv_level_school_quest',
    'data_link_at_indiv_level_heads_quest',
    'data_link_at_indiv_level_teach_quest',
    'data_link_at_indiv_level_par_quest'
]

DATA_LINKABILITY_LABELS = {
    'data_link_at_indiv_level_stud_quest': "Students' Questionnaire",
    'data_link_at_indiv_level_stud_test': "Students' Test",
    'data_link_at_indiv_level_school_quest': 'School Questionnaire',
    'data_link_at_indiv_level_heads_quest': "Headmaster's Questionnaire",
    'data_link_at_indiv_level_teach_quest': "Teachers' Questionnaire",
    'data_link_at_indiv_level_par_quest': "Parents' Questionnaire"
}

# Campi per le variabili degli studenti/famiglie/insegnanti/scuola (Yes/No/Not clear)
VARIABLE_FIELDS = {
    # Students' Information
    "Student Gender": 'st_gender',
    "Student Age": 'st_age',
    "Student Citizenship": 'st_citizen',
    "Student Foreign Birth Country": 'st_for_brth_cntry',
    "Student Specific Birth Country": 'st_spec_brth_cntry',
    "Student Town of Residence": 'st_town_of_resid',
    "Student Province of Residence": 'st_prov_of_resid',
    "Student Region of Residence": 'st_reg_of_resid',
    "Student Belonging to a Recognized Ethnic Minority": 'st_belong_to_a_recog_ethn_min',
    "Student ECEC Attendance": 'st_ecec_attnd',
    "Student Previous Grade Retention": 'st_prev_grade_retent',
    "Student Learning Impairments": 'st_learn_impair',
    "Student Physical Impairments": 'st_phys_impair',
    "Student School Attitude or Motivation": 'st_school_attit_or_motiv',
    "Student Assigned Teacher Grades": 'st_assgn_teach_grd',
    "Student Allowance/Scholarship": 'st_allowschlr',
    "Student Information Type": 'st_info_type',
    
    # Household's Information
    "Number of Parents": 'num_of_par',
    "Presence of Stepparents": 'pres_of_steppar',
    "Siblings": 'sibl',
    "Parental Working Status": 'paral_work_stat',
    "Parental Occupation": 'paral_occup',
    "Parental Education": 'paral_edu',
    "Parental Education Level (ISCED)": 'paral_edu_level_iscd',
    "Parental Migratory Background": 'paral_migr_bg',
    "Parents Age": 'par_age',
    "Parents Place of Birth": 'par_plc_of_brth',
    "Parental Income or Wealth": 'paral_inc_or_wlth',
    "Parental Host Country's Language Proficiency": 'paral_host_cntrys_lang_prof',
    "Number of Books": 'num_of_bks',
    "Number of Digital Devices": 'num_of_dgtl_dev',
    "Ownership of the Apartment/House": 'own_of_the_apthse', 
    "Household Information Type": 'hse_info_type',
    
    # Teachers' Information
    "Teacher Age": 'teach_age',
    "Teacher Gender": 'teach_gender',
    "Teacher Seniority": 'teach_senior',
    "Teacher Educational Degree": 'teach_edu_deg',
    "Teacher Contract Type": 'teach_contr_type', 
    "Teacher Information Type": 'teach_info_type',
    "Teacher Information Link": 'teach_info_link',
    
    # School/Class Information
    "School Geo-Referencing": 'school_geo',
    "School Type": 'school_type',
    "School Track": 'school_track',
    "School Size": 'school_size',
    "Class Size": 'class_size',
    "School Composition": 'school_comp',
    "Class Composition": 'class_comp'
}

VARIABLE_OPTIONS = ['Yes', 'No', 'Not clear']

# Campi di testo libero (textarea)
TEXT_AREA_FIELDS = [
    'short_description',
    'samp_level_det',
    'other_skl_det',
    'samp_weig_crit'
]

# Campi numerici
NUMERIC_FIELDS = [
    'starting_year',
    'avg_samp_size_x_wave'
]

# Campo ending_year può essere un anno o "ongoing"
# Viene gestito separatamente nel template

# Campi URL
URL_FIELDS = [
    'off_web'
]

# Campi di testo normale
TEXT_FIELDS = [
    'name',
    'acronym'
]

# Campi che vanno nascosti (timestamp, id, ecc.)
HIDDEN_FIELDS = [
    'id',
    'created_at',
    'updated_at'
]

def get_field_type(field_name):
    """
    Determina il tipo di campo in base al nome
    
    Args:
        field_name (str): Nome del campo
        
    Returns:
        str: Tipo di campo
    """
    if field_name in HIDDEN_FIELDS:
        return 'hidden'
    elif field_name in TEXT_FIELDS:
        return 'text'
    elif field_name == 'cntry':
        return 'select'
    elif field_name in FORM_OPTIONS:
        return 'select'
    elif field_name in (RESPONSIBLE_ORG_FIELDS + DATA_COLL_PURPOSE_FIELDS + 
                       DATA_COLL_FOCUS_FIELDS + SCHOOL_GRADES_FIELDS +
                       SKILLS_ANALYZED_FIELDS + MEASURE_TYPE_FIELDS +
                       SAMPLE_TYPE_FIELDS + SAMPLE_UNIT_FIELDS +
                       DATA_LINKABILITY_FIELDS):
        return 'checkbox'
    elif field_name in [v for v in VARIABLE_FIELDS.values()]:
        return 'select'  # Yes/No/Not clear
    elif field_name in TEXT_AREA_FIELDS:
        return 'textarea'
    elif field_name in NUMERIC_FIELDS:
        return 'number'
    elif field_name in URL_FIELDS:
        return 'url'
    else:
        return 'text'

def is_required_field(field_name):
    """
    Verifica se un campo è obbligatorio
    
    Args:
        field_name (str): Nome del campo
        
    Returns:
        bool: True se il campo è obbligatorio
    """
    return field_name in REQUIRED_FIELDS or field_name in REQUIRED_VARIABLE_FIELDS

def get_field_options(field_name):
    """
    Ottiene le opzioni per un campo select o checkbox
    
    Args:
        field_name (str): Nome del campo
        
    Returns:
        list: Lista di opzioni o lista vuota se non applicabile
    """
    if field_name == 'cntry':
        return COUNTRIES
    elif field_name in FORM_OPTIONS:
        return FORM_OPTIONS[field_name]
    elif field_name in [v for v in VARIABLE_FIELDS.values()]:
        return VARIABLE_OPTIONS
    return []

def get_field_label(field_name):
    """
    Ottiene l'etichetta leggibile per un campo
    
    Args:
        field_name (str): Nome del campo nel database
        
    Returns:
        str: Etichetta leggibile
    """
    # Mappa dei campi con label custom
    labels = {
        'name': 'Name',
        'acronym': 'Acronym',
        'short_description': 'Short Description',
        'cntry': 'Country',
        'long_data_struct': 'Longitudinal Data Structure',
        'type_of_long_data': 'Type of Longitudinal Data',
        'data_coll_freq': 'Data Collection Frequency',
        'starting_year': 'Starting Year',
        'ending_year': 'Ending Year',
        'samp_level': 'Sample Level',
        'samp_level_det': 'Sample Level (Details)',
        'info_on_ecec_or_preprim_edu': 'Information on ECEC or Pre-Primary Education',
        'stud_foll_after_school_edu': 'Students Followed After School Education',
        'admin_meth': 'Administration Method',
        'other_skl_det': 'Other Skills (Details)',
        'samp_weig_crit': 'Sampling Weights/Criteria',
        'avg_samp_size_x_wave': 'Average Sample Size x Wave',
        'data_link_at_indiv_level': 'Data Linkability At Individual Level',
        'acc_to_mic_data': 'Access to Micro Data',
        'constr_for_data_dwnld_and_mgmt': 'Constraints for Data Download and Management',
        'off_web': 'Official Website'
    }
    
    # Aggiungi label per Responsible Organization
    labels.update({k: v for k, v in RESPONSIBLE_ORG_LABELS.items()})
    
    # Aggiungi label per Data Collection Purpose
    labels.update({k: v for k, v in DATA_COLL_PURPOSE_LABELS.items()})
    
    # Aggiungi label per Data Collection Focus
    labels.update({k: v for k, v in DATA_COLL_FOCUS_LABELS.items()})
    
    # Aggiungi label per School Grades
    labels.update({k: v for k, v in SCHOOL_GRADES_LABELS.items()})
    
    # Aggiungi label per Skills
    labels.update({k: v for k, v in SKILLS_ANALYZED_LABELS.items()})
    
    # Aggiungi label per Measure Types
    labels.update({k: v for k, v in MEASURE_TYPE_LABELS.items()})
    
    # Aggiungi label per Sample Types
    labels.update({k: v for k, v in SAMPLE_TYPE_LABELS.items()})
    
    # Aggiungi label per Sample Units
    labels.update({k: v for k, v in SAMPLE_UNIT_LABELS.items()})
    
    # Aggiungi label per Data Linkability
    labels.update({k: v for k, v in DATA_LINKABILITY_LABELS.items()})
    
    # Aggiungi label per Variables (inverte il dizionario)
    labels.update({v: k for k, v in VARIABLE_FIELDS.items()})
    
    return labels.get(field_name, field_name.replace('_', ' ').title())

def get_field_group(field_name):
    """
    Determina a quale gruppo appartiene un campo
    
    Args:
        field_name (str): Nome del campo
        
    Returns:
        str: Nome del gruppo
    """
    if field_name in ['name', 'acronym', 'short_description', 'cntry']:
        return 'Basic Information'
    elif field_name in RESPONSIBLE_ORG_FIELDS:
        return 'Responsible Organization'
    elif field_name in ['long_data_struct', 'type_of_long_data', 'data_coll_freq', 'starting_year', 'ending_year', 'samp_level', 'samp_level_det']:
        return 'Data Structure'
    elif field_name in DATA_COLL_PURPOSE_FIELDS:
        return 'Data Collection Purpose'
    elif field_name in DATA_COLL_FOCUS_FIELDS:
        return 'Data Collection Focus'
    elif field_name in SCHOOL_GRADES_FIELDS or field_name == 'info_on_ecec_or_preprim_edu' or field_name == 'stud_foll_after_school_edu':
        return 'School Grades'
    elif field_name in SKILLS_ANALYZED_FIELDS or field_name in MEASURE_TYPE_FIELDS or field_name == 'admin_meth' or field_name == 'other_skl_det':
        return 'Students\' Skills and Achievement'
    elif field_name in SAMPLE_TYPE_FIELDS or field_name in SAMPLE_UNIT_FIELDS or field_name in ['samp_weig_crit', 'avg_samp_size_x_wave']:
        return 'Sample'
    elif field_name in DATA_LINKABILITY_FIELDS or field_name == 'data_link_at_indiv_level':
        return 'Linkability'
    elif field_name in ['acc_to_mic_data', 'constr_for_data_dwnld_and_mgmt', 'off_web']:
        return 'Accessibility'
    elif field_name in [v for v in VARIABLE_FIELDS.values()]:
        # Determina se è Students, Household, Teachers o School
        for label, db_field in VARIABLE_FIELDS.items():
            if db_field == field_name:
                if 'Student' in label:
                    return 'Dataset Variables - Students\' Information'
                elif 'Parent' in label or 'Number of' in label or 'Siblings' in label or 'Ownership' in label:
                    return 'Dataset Variables - Household\'s Information'
                elif 'Teacher' in label:
                    return 'Dataset Variables - Teachers\' Information'
                elif 'School' in label or 'Class' in label:
                    return 'Dataset Variables - School/Class Information'
    return 'Other'

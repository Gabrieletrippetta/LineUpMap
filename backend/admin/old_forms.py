"""
Definizioni delle opzioni per i form
Questo file contiene tutte le opzioni disponibili per i select nei form
"""

# Campi obbligatori
REQUIRED_FIELDS = [
    'Name',
    'Acronym',
    'Country',
    'Longitudinal Data Structure',
    'Starting Year'
]

# Opzioni per i select dropdown
FORM_OPTIONS = {
    'Longitudinal Data Structure': [
        'Panel',
        'Cohort',
        'Repeated Cross-Sectional'
    ],
    
    'Type of Longitudinal Data': [
        'Prospective',
        'Retrospective',
        'Both'
    ],
    
    'Data Collection Frequency': [
        'Annual',
        'Biennial',
        'Every 3 years',
        'Every 4 years',
        'Every 5 years',
        'Irregular',
        'One-off',
        'Other'
    ],
    
    'Sample Level': [
        'National',
        'Limited to specific regions/areas',
        'Other'
    ],
    
    'Information on ECEC or Pre-Primary Education': [
        'Yes',
        'No'
    ],
    
    'Students Followed After School Education': [
        'Yes',
        'No',
        'Not clear'
    ],
    
    'Administration Method': [
        'Paper-based',
        'Computer-based',
        'Both',
        'Other'
    ],
    
    'Data Linkability At Individual Level': [
        'Yes',
        'No',
        'Partially'
    ],
    
    'Access to Micro Data': [
        'Yes, freely available',
        'Yes, upon request',
        'Yes, with restrictions',
        'No',
        'Not clear'
    ],
    
    'Constraints for Data Download and Management': [
        'No constraints',
        'Registration required',
        'Application/proposal required',
        'Fee required',
        'Data use agreement required',
        'On-site access only',
        'Other'
    ]
}

# Campi Yes/No (checkbox singoli)
YES_NO_FIELDS = [
    'Information on ECEC or Pre-Primary Education',
    'Students Followed After School Education',
]

# Campi multi-checkbox (con prefisso [valore])
MULTI_CHECKBOX_FIELDS = {
    'Responsible Organization': [
        'Ministry of Education',
        'National Statistical Office',
        'Research Institution',
        'University',
        'International Organization',
        'Private Company',
        'Other'
    ],
    
    'Data Collection Purpose': [
        'Educational Policy',
        'Research',
        'Monitoring',
        'Evaluation',
        'Administrative',
        'Other'
    ],
    
    'Data Collection Focus': [
        'Student Achievement',
        'Student Background',
        'School Characteristics',
        'Teacher Characteristics',
        'Parental Background',
        'Other'
    ],
    
    'School Grades Included': [
        'First Grade',
        'Second Grade',
        'Third Grade',
        'Fourth Grade',
        'Fifth Grade',
        'Sixth Grade',
        'Seventh Grade',
        'Eighth Grade',
        'Ninth Grade',
        'Tenth Grade',
        'Eleventh Grade',
        'Twelfth Grade',
        'Thirteenth Grade'
    ],
    
    'Type of Skills Analysed': [
        'Literacy',
        'Numeracy',
        'Science',
        'Foreign Language',
        'Other Skills'
    ],
    
    'Measure Type': [
        'Standardized Test',
        'Teacher Assessment',
        'Self-Assessment',
        'Parent Assessment',
        'Other'
    ],
    
    'Sample Type': [
        'Student Population',
        'Random Student Sample',
        'Non-random Student Sample',
        'Other'
    ],
    
    'Sample Unit': [
        'Countries/Cities',
        'Schools',
        'Classes',
        'Pupils'
    ],
    
    'Data Linkability At Individual Level': [
        'Administrative Records',
        'Census Data',
        'Other Surveys',
        'Health Records',
        'Employment Records',
        'Other'
    ]
}

# Campi per le variabili degli studenti/famiglie/insegnanti/scuola
VARIABLE_FIELDS = {
    "Student Gender": ['Yes', 'No', 'Not clear'],
    "Student Age": ['Yes', 'No', 'Not clear'],
    "Student Citizenship": ['Yes', 'No', 'Not clear'],
    "Student Foreign Birth Country": ['Yes', 'No', 'Not clear'],
    "Student Specific Birth Country": ['Yes', 'No', 'Not clear'],
    "Student Town of Residence": ['Yes', 'No', 'Not clear'],
    "Student Province of Residence": ['Yes', 'No', 'Not clear'],
    "Student Region of Residence": ['Yes', 'No', 'Not clear'],
    "Student Belonging to a Recognised Ethnic Minority": ['Yes', 'No', 'Not clear'],
    "Student ECEC Attendance": ['Yes', 'No', 'Not clear'],
    "Student Previous Grade Retention": ['Yes', 'No', 'Not clear'],
    "Student Learning Impairments": ['Yes', 'No', 'Not clear'],
    "Student Physical Impairments": ['Yes', 'No', 'Not clear'],
    "Student School Attitude or Motivation": ['Yes', 'No', 'Not clear'],
    "Student Assigned Teacher Grades": ['Yes', 'No', 'Not clear'],
    "Student Allowance/Scholarship": ['Yes', 'No', 'Not clear'],
    
    "Number of Parents": ['Yes', 'No', 'Not clear'],
    "Presence of Stepparents": ['Yes', 'No', 'Not clear'],
    "Siblings": ['Yes', 'No', 'Not clear'],
    "Parental Working Status": ['Yes', 'No', 'Not clear'],
    "Parental Occupation": ['Yes', 'No', 'Not clear'],
    "Parental Education": ['Yes', 'No', 'Not clear'],
    "Parental Education Level (ISCED)": ['Yes', 'No', 'Not clear'],
    "Parental Migratory Background": ['Yes', 'No', 'Not clear'],
    "Parents Age": ['Yes', 'No', 'Not clear'],
    "Parents Place Of Birth": ['Yes', 'No', 'Not clear'],
    "Parental Income or Wealth": ['Yes', 'No', 'Not clear'],
    "Parental Host Country's Language Proficiency": ['Yes', 'No', 'Not clear'],
    "Number of Books": ['Yes', 'No', 'Not clear'],
    "Number of Digital Devices": ['Yes', 'No', 'Not clear'],
    "Ownership of the Apartment/House": ['Yes', 'No', 'Not clear'],
    
    "Teacher Age": ['Yes', 'No', 'Not clear'],
    "Teacher Gender": ['Yes', 'No', 'Not clear'],
    "Teacher Seniority": ['Yes', 'No', 'Not clear'],
    "Teacher Educational Degree": ['Yes', 'No', 'Not clear'],
    "Teacher Contract Type": ['Yes', 'No', 'Not clear'],
    
    "School Geo-Referencing": ['Yes', 'No', 'Not clear'],
    "School Type": ['Yes', 'No', 'Not clear'],
    "School Track": ['Yes', 'No', 'Not clear'],
    "School Size": ['Yes', 'No', 'Not clear'],
    "Class Size": ['Yes', 'No', 'Not clear'],
    "School Composition": ['Yes', 'No', 'Not clear'],
    "Class Composition": ['Yes', 'No', 'Not clear']
}

# Campi di testo libero (textarea)
TEXT_AREA_FIELDS = [
    'Short Description',
    'Sample Level (Details)',
    'Other Skills (Details)',
    'Sampling Weights/Criteria'
]

# Campi numerici
NUMERIC_FIELDS = [
    'Starting Year',
    'Ending Year',
    'Average Sample Size x Wave'
]

# Campi URL
URL_FIELDS = [
    'Official Website'
]

def get_field_type(field_name):
    """
    Determina il tipo di campo in base al nome
    
    Args:
        field_name (str): Nome del campo
        
    Returns:
        str: Tipo di campo ('select', 'multi-checkbox', 'textarea', 'number', 'url', 'text')
    """
    if field_name in FORM_OPTIONS:
        return 'select'
    elif field_name in MULTI_CHECKBOX_FIELDS:
        return 'multi-checkbox'
    elif field_name in VARIABLE_FIELDS:
        return 'select'
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
    return field_name in REQUIRED_FIELDS

def get_field_options(field_name):
    """
    Ottiene le opzioni per un campo select o multi-checkbox
    
    Args:
        field_name (str): Nome del campo
        
    Returns:
        list: Lista di opzioni o lista vuota se non applicabile
    """
    if field_name in FORM_OPTIONS:
        return FORM_OPTIONS[field_name]
    elif field_name in MULTI_CHECKBOX_FIELDS:
        return MULTI_CHECKBOX_FIELDS[field_name]
    elif field_name in VARIABLE_FIELDS:
        return VARIABLE_FIELDS[field_name]
    return []

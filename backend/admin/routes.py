"""
Routes per l'area admin
"""

from flask import render_template, request, redirect, url_for, flash, jsonify, session
from . import admin_bp
from .auth import login_required, verify_credentials, login_user, logout_user, get_current_user, get_csrf_token
from .models import (
    get_all_datasets, get_dataset_by_id, update_dataset, 
    create_dataset, delete_dataset, get_column_names, get_unique_values
)
from .forms import get_field_type, is_required_field, get_field_options, REQUIRED_FIELDS, REQUIRED_VARIABLE_FIELDS
import json

@admin_bp.route('/')
@login_required
def index():
    """Redirect alla dashboard"""
    return redirect(url_for('admin.dashboard'))

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    """
    Pagina di login
    """
    # Se già loggato, redirect alla dashboard
    if session.get('admin_logged_in'):
        return redirect(url_for('admin.dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        
        if not username or not password:
            flash('Username e password sono obbligatori', 'error')
            return render_template('login.html')
        
        if verify_credentials(username, password):
            login_user(username)
            flash(f'Benvenuto, {username}!', 'success')
            
            # Redirect alla pagina richiesta o alla dashboard
            next_page = request.args.get('next')
            if next_page and next_page.startswith('/admin'):
                return redirect(next_page)
            return redirect(url_for('admin.dashboard'))
        else:
            flash('Username o password non corretti', 'error')
    
    return render_template('login.html')

@admin_bp.route('/logout')
@login_required
def logout():
    """
    Logout dell'utente
    """
    logout_user()
    flash('Logout effettuato con successo', 'info')
    return redirect(url_for('admin.login'))

@admin_bp.route('/dashboard')
@login_required
def dashboard():
    """
    Dashboard principale con lista dei dataset
    """
    page = request.args.get('page', 1, type=int)
    per_page = 20
    search = request.args.get('search', '').strip()
    
    offset = (page - 1) * per_page
    datasets, total = get_all_datasets(limit=per_page, offset=offset, search=search or None)
    
    total_pages = (total + per_page - 1) // per_page
    
    return render_template('dashboard.html',
                         datasets=datasets,
                         page=page,
                         total_pages=total_pages,
                         total=total,
                         search=search,
                         username=get_current_user())

@admin_bp.route('/dataset/new', methods=['GET', 'POST'])
@login_required
def new_dataset():
    """
    Form per creare un nuovo dataset
    """
    if request.method == 'POST':
        # Raccogli tutti i dati dal form
        data = {}
        columns = get_column_names()
        
        for column in columns:
            if column == 'id':
                continue
            
            # Gestisci multi-checkbox (campi con [opzione])
            if any(column.startswith(f"{field} [") for field in ['Responsible Organization', 'Data Collection Purpose', 'Data Collection Focus', 'School Grades Included', 'Type of Skills Analysed', 'Measure Type', 'Sample Type', 'Sample Unit']):
                # Questo è un campo multi-checkbox
                value = 'Yes' if request.form.get(column) else 'No'
                data[column] = value
            else:
                # Campo normale
                value = request.form.get(column, '').strip()
                data[column] = value if value else None
        
        # Valida campi obbligatori
        missing_fields = []
        for field in REQUIRED_FIELDS:
            if not data.get(field):
                missing_fields.append(field)
        
        for field in REQUIRED_VARIABLE_FIELDS:
            if not data.get(field):
                missing_fields.append(field)
        
        if missing_fields:
            flash(f'Campi obbligatori mancanti: {", ".join(missing_fields)}', 'error')
            return render_template('edit_dataset.html',
                                 dataset=data,
                                 columns=columns,
                                 is_new=True,
                                 csrf_token=get_csrf_token())
        
        # Crea il dataset
        success, message, dataset_id = create_dataset(data)
        
        if success:
            flash(message, 'success')
            return redirect(url_for('admin.edit_dataset', dataset_id=dataset_id))
        else:
            flash(message, 'error')
            return render_template('edit_dataset.html',
                                 dataset=data,
                                 columns=columns,
                                 is_new=True,
                                 csrf_token=get_csrf_token())
    
    # GET: Mostra form vuoto
    columns = get_column_names()
    return render_template('edit_dataset.html',
                         dataset={},
                         columns=columns,
                         is_new=True,
                         csrf_token=get_csrf_token())

@admin_bp.route('/dataset/<int:dataset_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_dataset(dataset_id):
    """
    Form per modificare un dataset esistente
    """
    dataset = get_dataset_by_id(dataset_id)
    
    if not dataset:
        flash('Dataset non trovato', 'error')
        return redirect(url_for('admin.dashboard'))
    
    if request.method == 'POST':
        # Raccogli tutti i dati dal form
        data = {}
        columns = get_column_names()
        
        for column in columns:
            if column == 'id':
                continue
            
            # Gestisci multi-checkbox
            if any(column.startswith(f"{field} [") for field in ['Responsible Organization', 'Data Collection Purpose', 'Data Collection Focus', 'School Grades Included', 'Type of Skills Analysed', 'Measure Type', 'Sample Type', 'Sample Unit']):
                value = 'Yes' if request.form.get(column) else 'No'
                data[column] = value
            else:
                value = request.form.get(column, '').strip()
                data[column] = value if value else None
        
        # Valida campi obbligatori
        missing_fields = []
        for field in REQUIRED_FIELDS:
            if not data.get(field):
                missing_fields.append(field)
        
        for field in REQUIRED_VARIABLE_FIELDS:
            if not data.get(field):
                missing_fields.append(field)
        
        if missing_fields:
            flash(f'Campi obbligatori mancanti: {", ".join(missing_fields)}', 'error')
            dataset.update(data)
            return render_template('edit_dataset.html',
                                 dataset=dataset,
                                 columns=columns,
                                 is_new=False,
                                 csrf_token=get_csrf_token())
        
        # Aggiorna il dataset
        success, message = update_dataset(dataset_id, data)
        
        if success:
            flash(message, 'success')
            return redirect(url_for('admin.dashboard'))
        else:
            flash(message, 'error')
            dataset.update(data)
            return render_template('edit_dataset.html',
                                 dataset=dataset,
                                 columns=columns,
                                 is_new=False,
                                 csrf_token=get_csrf_token())
    
    # GET: Mostra form con dati esistenti
    columns = get_column_names()
    return render_template('edit_dataset.html',
                         dataset=dataset,
                         columns=columns,
                         is_new=False,
                         csrf_token=get_csrf_token())

@admin_bp.route('/dataset/<int:dataset_id>/delete', methods=['POST'])
@login_required
def delete_dataset_route(dataset_id):
    """
    Elimina un dataset
    """
    success, message = delete_dataset(dataset_id)
    
    if success:
        flash(message, 'success')
    else:
        flash(message, 'error')
    
    return redirect(url_for('admin.dashboard'))

# API endpoints per AJAX
@admin_bp.route('/api/field-info/<field_name>')
@login_required
def field_info(field_name):
    """
    Restituisce informazioni su un campo (tipo, opzioni, ecc.)
    """
    field_type = get_field_type(field_name)
    is_required = is_required_field(field_name)
    options = get_field_options(field_name)
    
    return jsonify({
        'field_name': field_name,
        'field_type': field_type,
        'is_required': is_required,
        'options': options
    })

@admin_bp.route('/api/unique-values/<column_name>')
@login_required
def unique_values(column_name):
    """
    Restituisce i valori unici di una colonna
    Utile per autocomplete
    """
    values = get_unique_values(column_name)
    return jsonify({'values': values})

# Error handlers
@admin_bp.errorhandler(404)
def not_found(error):
    flash('Pagina non trovata', 'error')
    return redirect(url_for('admin.dashboard'))

@admin_bp.errorhandler(500)
def internal_error(error):
    flash('Errore interno del server', 'error')
    return redirect(url_for('admin.dashboard'))

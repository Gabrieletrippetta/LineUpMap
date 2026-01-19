"""
Gestione autenticazione per l'area admin
"""

from functools import wraps
from flask import session, redirect, url_for, flash, current_app
from werkzeug.security import check_password_hash, generate_password_hash
import secrets

def login_required(f):
    """
    Decorator per proteggere le routes admin
    Redirige al login se l'utente non è autenticato
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not is_logged_in():
            flash('Devi effettuare il login per accedere a questa pagina.', 'warning')
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated_function

def is_logged_in():
    """
    Verifica se l'utente è loggato
    """
    return session.get('admin_logged_in', False)

def verify_credentials(username, password):
    """
    Verifica username e password
    
    Args:
        username (str): Username inserito
        password (str): Password inserita
        
    Returns:
        bool: True se le credenziali sono corrette
    """
    admin_username = current_app.config.get('ADMIN_USERNAME')
    admin_password_hash = current_app.config.get('ADMIN_PASSWORD_HASH')
    
    # Verifica username
    if username != admin_username:
        return False
    
    # Verifica password
    return check_password_hash(admin_password_hash, password)

def login_user(username):
    """
    Imposta la sessione per l'utente loggato
    
    Args:
        username (str): Username dell'admin
    """
    session.clear()
    session['admin_logged_in'] = True
    session['admin_username'] = username
    session['csrf_token'] = secrets.token_hex(16)
    session.permanent = True

def logout_user():
    """
    Rimuove la sessione dell'utente
    """
    session.clear()

def get_current_user():
    """
    Restituisce l'username dell'utente corrente
    
    Returns:
        str: Username o None se non loggato
    """
    if is_logged_in():
        return session.get('admin_username')
    return None

def generate_password_hash_string(password):
    """
    Utility per generare l'hash di una password
    Usa questa funzione per creare nuovi hash da mettere in config.py
    
    Args:
        password (str): Password in chiaro
        
    Returns:
        str: Hash della password
        
    Esempio:
        >>> generate_password_hash_string('miapassword123')
        'pbkdf2:sha256:600000$...'
    """
    return generate_password_hash(password)

# Utility per verificare il CSRF token
def verify_csrf_token(token):
    """
    Verifica il token CSRF
    
    Args:
        token (str): Token da verificare
        
    Returns:
        bool: True se il token è valido
    """
    return token == session.get('csrf_token')

def get_csrf_token():
    """
    Ottiene il token CSRF corrente o ne genera uno nuovo
    
    Returns:
        str: CSRF token
    """
    if 'csrf_token' not in session:
        session['csrf_token'] = secrets.token_hex(16)
    return session['csrf_token']

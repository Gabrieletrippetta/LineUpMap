"""
Admin module for LINEup Education Data Explorer
Gestisce l'autenticazione e le operazioni CRUD sui dataset
"""

from flask import Blueprint

# Crea il Blueprint per le routes admin
admin_bp = Blueprint('admin', __name__, 
                    url_prefix='/admin',
                    template_folder='templates',
                    static_folder='static')

# Importa le routes dopo aver creato il blueprint per evitare circular imports
from . import routes

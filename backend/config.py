import os
from datetime import timedelta

class Config:
    """Configurazione base dell'applicazione"""
    
    # Secret key per sessioni e CSRF protection
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-this-in-production'
    
    # Database
    MYSQL_HOST = os.environ.get('DB_HOST') or 'localhost'
    MYSQL_USER = os.environ.get('DB_USER') or 'root'
    MYSQL_PASSWORD = os.environ.get('DB_PASSWORD') or ''
    MYSQL_DB = os.environ.get('DB_NAME') or 'lineup_mapping_data' 
    MYSQL_PORT = int(os.environ.get('DB_PORT', 3306))
    
    # Session configuration
    PERMANENT_SESSION_LIFETIME = timedelta(hours=2)
    SESSION_COOKIE_SECURE = False  # Cambia in True se usi HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # Admin configuration
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME') or 'admin'
    # Password di default: "admin123" - CAMBIALA IN PRODUZIONE!
    # Hash generato con: from werkzeug.security import generate_password_hash
    ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH') or 'scrypt:32768:8:1$EFAZCzAFLkHD8gHc$5d324f34ccdf64f5b4361dc0335a0471040dac5aa49f0f3ea0446a470844c897bcee49f0d3a9b80b548e4f7f13e9ed01b008c14facdaa22fdda9b5cbb2e5f0bc'
    
    # CORS
    CORS_ORIGINS = ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:5000']
    
    # Upload configuration (per future feature di upload file)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}

class DevelopmentConfig(Config):
    """Configurazione per sviluppo"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Configurazione per produzione"""
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = True  # Richiede HTTPS

class TestingConfig(Config):
    """Configurazione per testing"""
    TESTING = True
    DB_DB = 'lineup_data_test'

# Scegli la configurazione in base all'ambiente
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

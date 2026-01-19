"""
Modelli e funzioni per interagire con il database
"""

import mysql.connector
from mysql.connector import Error
from flask import current_app
from datetime import datetime

def get_db_connection():
    """
    Crea una connessione al database MySQL
    
    Returns:
        mysql.connector.connection.MySQLConnection: Connessione al DB
    """
    try:
        connection = mysql.connector.connect(
            host=current_app.config['MYSQL_HOST'],
            user=current_app.config['MYSQL_USER'],
            password=current_app.config['MYSQL_PASSWORD'],
            database=current_app.config['MYSQL_DB'],
            port=current_app.config['MYSQL_PORT']
        )
        return connection
    except Error as e:
        current_app.logger.error(f"Errore connessione database: {e}")
        return None

def get_all_datasets(limit=None, offset=0, search=None):
    """
    Recupera tutti i dataset dal database
    
    Args:
        limit (int): Numero massimo di risultati
        offset (int): Offset per paginazione
        search (str): Termine di ricerca (opzionale)
        
    Returns:
        tuple: (datasets, total_count)
    """
    conn = get_db_connection()
    if not conn:
        return [], 0
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        # Query per contare il totale
        count_query = "SELECT COUNT(*) as total FROM datasets"
        where_clause = ""
        params = []
        
        if search:
            where_clause = " WHERE name LIKE %s OR acronym LIKE %s OR cntry LIKE %s"
            search_term = f"%{search}%"
            params = [search_term, search_term, search_term]
            count_query += where_clause
        
        cursor.execute(count_query, params)
        total_count = cursor.fetchone()['total']
        
        # Query per i dati
        query = "SELECT * FROM datasets"
        if where_clause:
            query += where_clause
        query += " ORDER BY id ASC"
        
        if limit:
            query += f" LIMIT {limit} OFFSET {offset}"
        
        cursor.execute(query, params)
        datasets = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return datasets, total_count
        
    except Error as e:
        current_app.logger.error(f"Errore nel recupero datasets: {e}")
        if conn:
            conn.close()
        return [], 0

def get_dataset_by_id(dataset_id):
    """
    Recupera un singolo dataset per ID
    
    Args:
        dataset_id (int): ID del dataset
        
    Returns:
        dict: Dataset o None se non trovato
    """
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM datasets WHERE id = %s"
        cursor.execute(query, (dataset_id,))
        dataset = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return dataset
        
    except Error as e:
        current_app.logger.error(f"Errore nel recupero dataset {dataset_id}: {e}")
        if conn:
            conn.close()
        return None

def get_column_names():
    """
    Recupera i nomi di tutte le colonne della tabella datasets
    
    Returns:
        list: Lista dei nomi delle colonne
    """
    conn = get_db_connection()
    if not conn:
        return []
    
    try:
        cursor = conn.cursor()
        query = "SHOW COLUMNS FROM datasets"
        cursor.execute(query)
        columns = [column[0] for column in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        
        return columns
        
    except Error as e:
        current_app.logger.error(f"Errore nel recupero colonne: {e}")
        if conn:
            conn.close()
        return []

def update_dataset(dataset_id, data):
    """
    Aggiorna un dataset esistente
    
    Args:
        dataset_id (int): ID del dataset da aggiornare
        data (dict): Dizionario con i dati da aggiornare
        
    Returns:
        tuple: (success: bool, message: str)
    """
    conn = get_db_connection()
    if not conn:
        return False, "Errore di connessione al database"
    
    try:
        cursor = conn.cursor()
        
        # Costruisci la query UPDATE dinamicamente
        set_clauses = []
        values = []
        
        for key, value in data.items():
            if key != 'id':  # Non aggiornare l'ID
                set_clauses.append(f"`{key}` = %s")
                values.append(value)
        
        values.append(dataset_id)
        
        query = f"UPDATE datasets SET {', '.join(set_clauses)} WHERE id = %s"
        
        cursor.execute(query, values)
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return True, "Dataset aggiornato con successo"
        
    except Error as e:
        current_app.logger.error(f"Errore nell'aggiornamento dataset {dataset_id}: {e}")
        if conn:
            conn.close()
        return False, f"Errore nell'aggiornamento: {str(e)}"

def create_dataset(data):
    """
    Crea un nuovo dataset
    
    Args:
        data (dict): Dizionario con i dati del nuovo dataset
        
    Returns:
        tuple: (success: bool, message: str, dataset_id: int or None)
    """
    conn = get_db_connection()
    if not conn:
        return False, "Errore di connessione al database", None
    
    try:
        cursor = conn.cursor()
        
        # Costruisci la query INSERT dinamicamente
        columns = list(data.keys())
        placeholders = ', '.join(['%s'] * len(columns))
        column_names = ', '.join([f"`{col}`" for col in columns])
        
        query = f"INSERT INTO datasets ({column_names}) VALUES ({placeholders})"
        values = list(data.values())
        
        cursor.execute(query, values)
        conn.commit()
        
        dataset_id = cursor.lastrowid
        
        cursor.close()
        conn.close()
        
        return True, "Dataset creato con successo", dataset_id
        
    except Error as e:
        current_app.logger.error(f"Errore nella creazione dataset: {e}")
        if conn:
            conn.close()
        return False, f"Errore nella creazione: {str(e)}", None

def delete_dataset(dataset_id):
    """
    Elimina un dataset
    
    Args:
        dataset_id (int): ID del dataset da eliminare
        
    Returns:
        tuple: (success: bool, message: str)
    """
    conn = get_db_connection()
    if not conn:
        return False, "Errore di connessione al database"
    
    try:
        cursor = conn.cursor()
        
        query = "DELETE FROM datasets WHERE id = %s"
        cursor.execute(query, (dataset_id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            return False, "Dataset non trovato"
        
        cursor.close()
        conn.close()
        
        return True, "Dataset eliminato con successo"
        
    except Error as e:
        current_app.logger.error(f"Errore nell'eliminazione dataset {dataset_id}: {e}")
        if conn:
            conn.close()
        return False, f"Errore nell'eliminazione: {str(e)}"

def get_unique_values(column_name):
    """
    Recupera i valori unici di una colonna
    Utile per popolare i dropdown nei form
    
    Args:
        column_name (str): Nome della colonna
        
    Returns:
        list: Lista di valori unici
    """
    conn = get_db_connection()
    if not conn:
        return []
    
    try:
        cursor = conn.cursor()
        query = f"SELECT DISTINCT `{column_name}` FROM datasets WHERE `{column_name}` IS NOT NULL AND `{column_name}` != '' ORDER BY `{column_name}`"
        cursor.execute(query)
        values = [row[0] for row in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        
        return values
        
    except Error as e:
        current_app.logger.error(f"Errore nel recupero valori unici per {column_name}: {e}")
        if conn:
            conn.close()
        return []

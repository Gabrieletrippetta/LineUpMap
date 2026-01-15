// api.js - Modulo per gestire le chiamate API al backend

// Configurazione base
const API_BASE_URL = 'http://localhost:5000/api';

// Variabili globali per cache dei dati
let mappingData = [];
let jsonData = [];
let isDataLoaded = false;

/**
 * Funzione generica per fare chiamate API
 */
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Carica tutti i dataset dal database
 */
async function loadAllDatasets() {
    try {
        console.log('📥 Caricamento dati dal database...');
        const response = await fetchAPI('/datasets');
        
        if (response.success) {
            mappingData = response.data;
            jsonData = response.data; // Alias per compatibilità
            isDataLoaded = true;
            console.log(`✅ Caricati ${response.count} dataset dal database`);
            return response.data;
        } else {
            throw new Error(response.error || 'Errore nel caricamento dei dati');
        }
    } catch (error) {
        console.error('❌ Errore nel caricamento dei dataset:', error);
        alert('Errore nel caricamento dei dati. Assicurati che il server sia attivo.');
        return [];
    }
}

/**
 * Carica i dataset con filtri
 */
async function loadDatasetsWithFilters(filters = {}) {
    try {
        const queryParams = new URLSearchParams();
        
        if (filters.country) queryParams.append('country', filters.country);
        if (filters.acronym) queryParams.append('acronym', filters.acronym);
        if (filters.search) queryParams.append('search', filters.search);
        
        const endpoint = `/datasets${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetchAPI(endpoint);
        
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.error || 'Errore nel caricamento dei dati');
        }
    } catch (error) {
        console.error('❌ Errore nel caricamento filtrato:', error);
        return [];
    }
}

/**
 * Carica un singolo dataset per ID
 */
async function loadDatasetById(id) {
    try {
        const response = await fetchAPI(`/datasets/${id}`);
        
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.error || 'Dataset non trovato');
        }
    } catch (error) {
        console.error('❌ Errore nel caricamento del dataset:', error);
        return null;
    }
}

/**
 * Carica un dataset per acronimo
 */
async function loadDatasetByAcronym(acronym) {
    try {
        const response = await fetchAPI(`/datasets/by-acronym/${acronym}`);
        
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.error || 'Dataset non trovato');
        }
    } catch (error) {
        console.error('❌ Errore nel caricamento del dataset:', error);
        return null;
    }
}

/**
 * Carica tutti i dataset di un paese
 */
async function loadDatasetsByCountry(countryName) {
    try {
        const response = await fetchAPI(`/datasets/by-country/${encodeURIComponent(countryName)}`);
        
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.error || 'Nessun dataset trovato per questo paese');
        }
    } catch (error) {
        console.error('❌ Errore nel caricamento dei dataset per paese:', error);
        return [];
    }
}

/**
 * Carica la lista dei paesi
 */
async function loadCountries() {
    try {
        const response = await fetchAPI('/countries');
        
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.error || 'Errore nel caricamento dei paesi');
        }
    } catch (error) {
        console.error('❌ Errore nel caricamento dei paesi:', error);
        return [];
    }
}

/**
 * Carica le statistiche
 */
async function loadStatistics() {
    try {
        const response = await fetchAPI('/stats');
        
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.error || 'Errore nel caricamento delle statistiche');
        }
    } catch (error) {
        console.error('❌ Errore nel caricamento delle statistiche:', error);
        return null;
    }
}

/**
 * Verifica lo stato dell'API
 */
async function checkAPIHealth() {
    try {
        const response = await fetchAPI('/health');
        return response.status === 'ok';
    } catch (error) {
        console.error('❌ API non disponibile:', error);
        return false;
    }
}

/**
 * Inizializza l'applicazione caricando i dati
 */
async function initializeApp() {
    // Mostra loader
    showLoader();
    
    try {
        // Verifica che l'API sia attiva
        const apiIsHealthy = await checkAPIHealth();
        
        if (!apiIsHealthy) {
            throw new Error('API non disponibile. Assicurati che il server Flask sia avviato.');
        }
        
        // Carica tutti i dati
        await loadAllDatasets();
        
        // Inizializza script.js con i dati caricati
        if (typeof initializeWithData === 'function') {
            initializeWithData(mappingData);
        } else {
            console.warn('⚠️ initializeWithData non disponibile, attendo...');
        }
        
        // Carica le statistiche per la mappa
        const stats = await loadStatistics();
        if (stats && stats.datasets_by_country) {
            // Verifica che la funzione updateMapColors sia disponibile
            if (typeof updateMapColors === 'function') {
                updateMapColors(stats.datasets_by_country);
            } else {
                console.warn('⚠️ updateMapColors non ancora disponibile, verrà chiamata in seguito');
                // Salva i dati per usarli quando la funzione sarà disponibile
                window.pendingMapData = stats.datasets_by_country;
            }
        }
        
        console.log('✅ Applicazione inizializzata con successo');
        
    } catch (error) {
        console.error('❌ Errore nell\'inizializzazione:', error);
        alert(`Errore: ${error.message}\n\nAssicurati che il server Flask sia avviato con: python app.py`);
    } finally {
        hideLoader();
    }
}

/**
 * Mostra un indicatore di caricamento
 */
function showLoader() {
    // Crea loader se non esiste
    if (!document.getElementById('api-loader')) {
        const loader = document.createElement('div');
        loader.id = 'api-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        loader.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p style="margin-top: 15px; margin-bottom: 0;">Caricamento dati...</p>
            </div>
        `;
        document.body.appendChild(loader);
    } else {
        document.getElementById('api-loader').style.display = 'flex';
    }
}

/**
 * Nascondi l'indicatore di caricamento
 */
function hideLoader() {
    const loader = document.getElementById('api-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Inizializza quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

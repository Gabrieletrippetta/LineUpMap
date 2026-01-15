// api.js - Modulo per gestire le chiamate API al backend
// Versione CORRETTA - non ridichiarata mappingData

// Configurazione base
const API_BASE_URL = 'http://localhost:5000/api';

// NON ridichiarare mappingData - è già dichiarato in script.js
// Usiamo quello globale che già esiste

console.log('🔵 api.js caricato');

/**
 * Funzione generica per fare chiamate API
 */
async function fetchAPI(endpoint, options = {}) {
    try {
        console.log(`🌐 Chiamata API: ${API_BASE_URL}${endpoint}`);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        console.log(`📡 Risposta ricevuta: status ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Dati parsati correttamente`);
        return data;
    } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
    }
}

/**
 * Carica tutti i dataset dal database
 */
async function loadAllDatasets() {
    try {
        console.log('🔥 Caricamento dati dal database...');
        const response = await fetchAPI('/datasets');
        
        console.log('📦 Risposta API:', response);
        
        if (response.success) {
            console.log(`✅ Caricati ${response.count} dataset dal database`);
            console.log('📊 Primo dataset:', response.data[0]);
            console.log('🔍 Campo Country del primo dataset:', response.data[0].Country);
            return response.data;
        } else {
            throw new Error(response.error || 'Errore nel caricamento dei dati');
        }
    } catch (error) {
        console.error('❌ Errore nel caricamento dei dataset:', error);
        showErrorInMap(`
            <div class="alert alert-danger m-4">
                <h4>❌ Errore di Connessione al Backend</h4>
                <p><strong>Dettagli:</strong> ${error.message}</p>
                <hr>
                <p><strong>Possibili cause:</strong></p>
                <ul>
                    <li>Il server Flask non è in esecuzione</li>
                    <li>CORS non configurato correttamente</li>
                    <li>Problemi di rete</li>
                </ul>
                <p class="mt-3"><strong>Soluzione:</strong></p>
                <ol>
                    <li>Assicurati che Flask sia attivo: <code>python app.py</code></li>
                    <li>Verifica che risponda su: <a href="${API_BASE_URL}/health" target="_blank">${API_BASE_URL}/health</a></li>
                    <li>Apri la console (F12) per dettagli</li>
                </ol>
            </div>
        `);
        return [];
    }
}

/**
 * Verifica lo stato dell'API
 */
async function checkAPIHealth() {
    try {
        console.log('🏥 Verifica health dell\'API...');
        const response = await fetchAPI('/health');
        const isHealthy = response.status === 'ok';
        console.log(`🏥 Health check: ${isHealthy ? '✅ OK' : '❌ FAILED'}`);
        return isHealthy;
    } catch (error) {
        console.error('❌ Health check fallito:', error);
        return false;
    }
}

/**
 * Mostra un errore nella zona della mappa
 */
function showErrorInMap(html) {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.innerHTML = html;
    } else {
        console.error('❌ Elemento #map non trovato nel DOM');
    }
}

/**
 * Mostra un indicatore di caricamento
 */
function showLoader() {
    console.log('⏳ Mostro loader...');
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
            <div style="background: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px;">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p style="margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Caricamento dati dal database...</p>
                <p style="margin: 0; font-size: 0.9em; color: #666;">Attendere prego</p>
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
    console.log('✅ Nascondo loader...');
    const loader = document.getElementById('api-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

/**
 * Inizializza l'applicazione caricando i dati
 */
async function initializeApp() {
    console.log('🚀 Inizializzazione applicazione...');
    
    // Mostra loader
    showLoader();
    
    try {
        // Verifica che l'API sia attiva
        console.log('🔍 Step 1: Verifica backend...');
        const apiIsHealthy = await checkAPIHealth();
        
        if (!apiIsHealthy) {
            throw new Error('API non disponibile. Assicurati che il server Flask sia avviato con: python app.py');
        }
        
        console.log('✅ Backend Flask è attivo');
        
        // Carica tutti i dati
        console.log('🔍 Step 2: Caricamento dataset...');
        const datasets = await loadAllDatasets();
        
        if (!datasets || datasets.length === 0) {
            throw new Error('Nessun dataset caricato dal database');
        }
        
        console.log(`✅ Dataset caricati: ${datasets.length}`);
        
        // Verifica che script.js sia caricato
        console.log('🔍 Step 3: Verifica funzione initializeWithData...');
        if (typeof initializeWithData === 'function') {
            console.log('✅ Funzione initializeWithData trovata');
            console.log('🔄 Chiamata initializeWithData con', datasets.length, 'dataset...');
            initializeWithData(datasets);
            console.log('✅ initializeWithData completata');
        } else {
            console.error('❌ Funzione initializeWithData NON TROVATA!');
            throw new Error('script.js non è stato caricato correttamente o initializeWithData non è definita');
        }
        
        console.log('✅ Applicazione inizializzata con successo');
        
    } catch (error) {
        console.error('❌ Errore nell\'inizializzazione:', error);
        showErrorInMap(`
            <div class="alert alert-danger m-4">
                <h4>❌ Errore di Inizializzazione</h4>
                <p><strong>Messaggio:</strong> ${error.message}</p>
                <hr>
                <p>Controlla la console del browser (F12) per maggiori dettagli.</p>
            </div>
        `);
    } finally {
        hideLoader();
    }
}

// Attendi che il DOM sia completamente caricato
console.log('🔵 Document readyState:', document.readyState);

if (document.readyState === 'loading') {
    console.log('⏳ DOM in caricamento, attendo DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ DOMContentLoaded event fired in api.js');
        initializeApp();
    });
} else {
    console.log('✅ DOM già caricato, inizializzo subito');
    // Piccolo delay per assicurarsi che script.js sia caricato
    setTimeout(initializeApp, 100);
}

// Esporta funzioni per debug da console
window.debugAPI = {
    checkHealth: checkAPIHealth,
    loadDatasets: loadAllDatasets,
    getMappingData: () => window.mappingData,
    API_BASE_URL: API_BASE_URL
};

console.log('💡 Debug disponibile: window.debugAPI');
console.log('💡 Prova: window.debugAPI.getMappingData()');

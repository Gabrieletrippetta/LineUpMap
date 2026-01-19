#!/usr/bin/env python3
"""
Script di test per verificare tutti gli endpoint dell'API
"""

import requests
import json
from colorama import init, Fore, Style

# Inizializza colorama per output colorato
init(autoreset=True)

API_BASE_URL = "http://localhost:5000/api"

def print_success(message):
    print(f"{Fore.GREEN}✓ {message}{Style.RESET_ALL}")

def print_error(message):
    print(f"{Fore.RED}✗ {message}{Style.RESET_ALL}")

def print_info(message):
    print(f"{Fore.CYAN}ℹ {message}{Style.RESET_ALL}")

def print_section(title):
    print(f"\n{Fore.YELLOW}{'='*60}")
    print(f"{title}")
    print(f"{'='*60}{Style.RESET_ALL}\n")

def test_health():
    """Test endpoint health check"""
    print_section("TEST 1: Health Check")
    
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'ok':
                print_success("API è attiva e funzionante")
                print_info(f"Response: {data}")
                return True
            else:
                print_error("API risponde ma status non è 'ok'")
                return False
        else:
            print_error(f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Errore di connessione: {e}")
        return False

def test_get_all_datasets():
    """Test endpoint per ottenere tutti i dataset"""
    print_section("TEST 2: Get All Datasets")
    
    try:
        response = requests.get(f"{API_BASE_URL}/datasets")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                count = data.get('count', 0)
                print_success(f"Caricati {count} dataset")
                
                if count > 0:
                    print_info(f"Primo dataset: {data['data'][0].get('Name', 'N/A')}")
                    print_info(f"Acronimo: {data['data'][0].get('Acronym', 'N/A')}")
                return True
            else:
                print_error(f"Errore: {data.get('error', 'Sconosciuto')}")
                return False
        else:
            print_error(f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Errore: {e}")
        return False

def test_search_datasets():
    """Test ricerca dataset"""
    print_section("TEST 3: Search Datasets")
    
    search_term = "education"
    
    try:
        response = requests.get(f"{API_BASE_URL}/datasets?search={search_term}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                count = data.get('count', 0)
                print_success(f"Trovati {count} dataset per '{search_term}'")
                return True
            else:
                print_error(f"Errore: {data.get('error', 'Sconosciuto')}")
                return False
        else:
            print_error(f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Errore: {e}")
        return False

def test_get_countries():
    """Test endpoint per ottenere la lista dei paesi"""
    print_section("TEST 4: Get Countries")
    
    try:
        response = requests.get(f"{API_BASE_URL}/countries")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                count = data.get('count', 0)
                print_success(f"Trovati {count} paesi")
                
                if count > 0:
                    countries = data.get('data', [])
                    print_info(f"Primi 5 paesi: {', '.join(countries[:5])}")
                return True
            else:
                print_error(f"Errore: {data.get('error', 'Sconosciuto')}")
                return False
        else:
            print_error(f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Errore: {e}")
        return False

def test_get_stats():
    """Test endpoint statistiche"""
    print_section("TEST 5: Get Statistics")
    
    try:
        response = requests.get(f"{API_BASE_URL}/stats")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                stats = data.get('data', {})
                print_success("Statistiche caricate")
                print_info(f"Totale dataset: {stats.get('total_datasets', 0)}")
                print_info(f"Numero paesi: {stats.get('countries_count', 0)}")
                
                # Mostra top 3 paesi
                by_country = stats.get('datasets_by_country', {})
                if by_country:
                    top_countries = sorted(by_country.items(), key=lambda x: x[1], reverse=True)[:3]
                    print_info("Top 3 paesi per numero di dataset:")
                    for country, count in top_countries:
                        print(f"   • {country}: {count}")
                return True
            else:
                print_error(f"Errore: {data.get('error', 'Sconosciuto')}")
                return False
        else:
            print_error(f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Errore: {e}")
        return False

def test_get_dataset_by_id():
    """Test recupero dataset per ID"""
    print_section("TEST 6: Get Dataset by ID")
    
    dataset_id = 1
    
    try:
        response = requests.get(f"{API_BASE_URL}/datasets/{dataset_id}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                dataset = data.get('data', {})
                print_success(f"Dataset trovato: {dataset.get('Name', 'N/A')}")
                print_info(f"Acronimo: {dataset.get('Acronym', 'N/A')}")
                print_info(f"Paese: {dataset.get('Country', 'N/A')}")
                return True
            else:
                print_error(f"Errore: {data.get('error', 'Sconosciuto')}")
                return False
        elif response.status_code == 404:
            print_error(f"Dataset con ID {dataset_id} non trovato")
            return False
        else:
            print_error(f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Errore: {e}")
        return False

def run_all_tests():
    """Esegue tutti i test"""
    print(f"\n{Fore.MAGENTA}{'='*60}")
    print("API TEST SUITE")
    print(f"Testing API at: {API_BASE_URL}")
    print(f"{'='*60}{Style.RESET_ALL}\n")
    
    tests = [
        ("Health Check", test_health),
        ("Get All Datasets", test_get_all_datasets),
        ("Search Datasets", test_search_datasets),
        ("Get Countries", test_get_countries),
        ("Get Statistics", test_get_stats),
        ("Get Dataset by ID", test_get_dataset_by_id),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print_error(f"Test fallito con eccezione: {e}")
            results.append((name, False))
    
    # Riepilogo
    print_section("RIEPILOGO TEST")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = f"{Fore.GREEN}PASS" if result else f"{Fore.RED}FAIL"
        print(f"{status}{Style.RESET_ALL} - {name}")
    
    print(f"\n{Fore.CYAN}Risultato: {passed}/{total} test passati{Style.RESET_ALL}")
    
    if passed == total:
        print(f"\n{Fore.GREEN}{'='*60}")
        print("✓ TUTTI I TEST SONO PASSATI! L'API FUNZIONA CORRETTAMENTE")
        print(f"{'='*60}{Style.RESET_ALL}\n")
    else:
        print(f"\n{Fore.RED}{'='*60}")
        print("✗ ALCUNI TEST SONO FALLITI")
        print(f"{'='*60}{Style.RESET_ALL}\n")
        print(f"{Fore.YELLOW}Suggerimenti:")
        print("1. Assicurati che il server Flask sia avviato: python app.py")
        print("2. Verifica che il database sia popolato: python import_data.py")
        print("3. Controlla le credenziali nel file .env")
        print(f"{Style.RESET_ALL}")

if __name__ == "__main__":
    try:
        run_all_tests()
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Test interrotti dall'utente{Style.RESET_ALL}")

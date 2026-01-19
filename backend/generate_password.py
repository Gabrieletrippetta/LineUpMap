#!/usr/bin/env python3
"""
Script per generare password hash per l'admin panel
Usa questo script per creare hash sicuri da mettere in config.py
"""

from werkzeug.security import generate_password_hash, check_password_hash
import sys

def generate_hash():
    """Genera un hash per una password"""
    print("=" * 60)
    print("🔐 Generatore Password Hash - LINEup Admin")
    print("=" * 60)
    print()
    
    password = input("Inserisci la password da hashare: ")
    
    if len(password) < 8:
        print("\n⚠️  ATTENZIONE: La password è troppo corta!")
        print("   Consigliamo almeno 12 caratteri per la produzione.")
        confirm = input("   Continuare comunque? (s/N): ")
        if confirm.lower() != 's':
            print("\n❌ Operazione annullata.")
            return
    
    # Genera l'hash
    hash_value = generate_password_hash(password)
    
    print("\n" + "=" * 60)
    print("✅ Hash generato con successo!")
    print("=" * 60)
    print()
    print("Copia questo valore in config.py:")
    print()
    print(f"ADMIN_PASSWORD_HASH = '{hash_value}'")
    print()
    print("=" * 60)
    
    # Test dell'hash
    print("\n🧪 Test di verifica...")
    if check_password_hash(hash_value, password):
        print("✅ Hash verificato correttamente!")
    else:
        print("❌ Errore nella verifica dell'hash!")
    
    print()

def test_hash():
    """Testa un hash esistente"""
    print("=" * 60)
    print("🧪 Test Password Hash - LINEup Admin")
    print("=" * 60)
    print()
    
    hash_value = input("Inserisci l'hash da testare: ")
    password = input("Inserisci la password da verificare: ")
    
    print()
    if check_password_hash(hash_value, password):
        print("✅ Password corretta! L'hash è valido.")
    else:
        print("❌ Password errata! L'hash non corrisponde.")
    print()

def main():
    """Main function"""
    if len(sys.argv) > 1 and sys.argv[1] == 'test':
        test_hash()
    else:
        generate_hash()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Operazione annullata dall'utente.")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Errore: {e}")
        sys.exit(1)

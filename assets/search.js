function getSearchFilters() {
    const search = document.getElementById('search-input').value.trim().toLowerCase();
    
    const selectedFilters = [];
    document.querySelectorAll('.dropdown-menu input[type="checkbox"]:checked').forEach(cb => {
        selectedFilters.push(cb.value);
    });
    
    return { search, selectedFilters };
}

function filterMappingData(data, filters) {
    return data.filter(entry => {
        const name = getField(entry, "Name").toLowerCase();
        const acronym = getField(entry, "Acronym").toLowerCase();
        const description = getField(entry, "Short Description").toLowerCase();
        const responsibleRaw = getField(entry, "Responsible Organization", "Responsible Organization [Public authority]", "Responsible Organization [University or Public Research Centre]", "Responsible Organization [Private organization]");
        const responsibleText = typeof responsibleRaw === "string" ? responsibleRaw.toLowerCase() : "";
        
        const searchTerms = filters.search.split(/\s+/).filter(Boolean);
        const allTermsMatch = (text) => searchTerms.every(term => text.includes(term));

        const matchesSearch = !filters.search || (
            allTermsMatch(name) ||
            allTermsMatch(acronym) ||
            allTermsMatch(description) ||
            allTermsMatch(responsibleText)
        );
        
        const matchesDropdowns = filters.selectedFilters.length === 0 || filters.selectedFilters.every(val => {
            return Object.values(entry).some(v => v && typeof v === "string" && v.toLowerCase().includes(val.toLowerCase()));
        });
        
        return matchesSearch && matchesDropdowns;
    });
}

function getCountryFromEntry(entry) {
    const raw = entry["Country"];
    if (!raw) return null;

    // Cerca ISO2 in formato "AT (Austria)" o "AT/DE (Austria, Germany)"
    const isoMatch = raw.match(/^([A-Z]{2,})(?:\/[A-Z]{2})*/);
    if (!isoMatch) return null;

    const isoCodes = isoMatch[0].split('/');
    for (let iso of isoCodes) {
        const found = Object.entries(countryNameToISO2).find(([name, code]) => code === iso || iso.includes(code));
        if (found) return found[0]; // nome nazione (es. "Austria")
    }

    return null;
}


function applyCountryFilter(data, selectedCountries) {
    if (!selectedCountries || selectedCountries.length === 0) return data;
    return data.filter(entry => {
        const countryName = getCountryFromEntry(entry);
        return selectedCountries.includes(countryName);
    });
}

function getSelectedCountries() {
    return [...document.querySelectorAll('input[data-filter="Country"]:checked')].map(cb => cb.value);
}

// Ricerca per checkbox (es. Type of Longitudinal Data)
function filterByCheckbox(groupLabel, selectedOptions) {
    const results = jsonData.filter((entry) => {
        return selectedOptions.some((option) => {
            const key = `${groupLabel} [${option}]`;
            const val = entry[key]?.toLowerCase();
            return val && val !== "no"; // accetta qualsiasi cosa tranne "no"
        });
    });

    showResultsModal(results, `Filter: ${groupLabel}`);
}


function applyFilters() {
    const filters = getSearchFilters();
    const selectedCountries = getSelectedCountries();

    const selectedInputs = document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');
    const selectedGroupedFilters = {};

    selectedInputs.forEach(input => {
        const group = input.dataset.filter;
        const value = input.value;
        if (!group || !value) return;
        if (!selectedGroupedFilters[group]) selectedGroupedFilters[group] = [];
        selectedGroupedFilters[group].push(value);
    });

    console.log("✅ Parola chiave:", filters.search);
    console.log("✅ Filtri checkbox:", selectedGroupedFilters);

    const filtered = mappingData.filter(entry => {
        if (selectedCountries.length > 0) {
            const raw = entry["Country"];
            let countryName = "";

            if (raw?.includes("(")) {
                const match = raw.match(/\(([^)]+)\)/); // UK (United Kingdom)
                countryName = match ? match[1] : raw;
            } else {
                countryName = raw;
            }

            if (!selectedCountries.includes(countryName)) {
                return false;
            }
        }

        const name = getField(entry, "Name").toLowerCase();
        const acronym = getField(entry, "Acronym").toLowerCase();
        const description = getField(entry, "Short Description").toLowerCase();
        const responsibleRaw = getField(entry, "Responsible Organization", "Responsible Organization [Public authority]", "Responsible Organization [University or Public Research Centre]", "Responsible Organization [Private organization]");
        const responsibleText = typeof responsibleRaw === "string" ? responsibleRaw.toLowerCase() : "";

        const searchTerms = filters.search.split(/\s+/).filter(Boolean);
        const allTermsMatch = (text) => searchTerms.every(term => text.includes(term));

        const matchesSearch = !filters.search || (
            allTermsMatch(name) ||
            allTermsMatch(acronym) ||
            allTermsMatch(description) ||
            allTermsMatch(responsibleText)
        );

        // filtraggio applicato con values.some (OR)
        const matchesGrouped = Object.entries(selectedGroupedFilters)
            .filter(([group]) => group !== "Country")
            .every(([group, values]) => {
                return values.some(val => {
                    // 1. Chiave diretta: group = "Parental Education", val = "for both parents"
                    const directVal = entry[group]?.toLowerCase() || "";

                    // 2. Chiave estesa: es. "Parental Education [for both parents]"
                    const extendedKey = `${group} [${val}]`;
                    const extendedVal = entry[extendedKey]?.toLowerCase() || "";

                    // 3. Match se valore è "yes", "yes, ...", o contiene la parola chiave
                    const directMatch =
                        directVal.startsWith("yes") || directVal.includes(val.toLowerCase());

                    const extendedMatch =
                        extendedVal.startsWith("yes") || extendedVal.includes(val.toLowerCase());

                    return directMatch || extendedMatch;
                });
            });

            zoomToCountry();
        return matchesSearch && matchesGrouped;
    });

    // Altrimenti mostra solo mappa (es. filtri paese)
    if (filters.search || Object.keys(selectedGroupedFilters).length > 0) {
        showResultsModal(filtered);
    } else {
        // Se non ci sono parole chiave o altri filtri, aggiorna la mappa con il filtro paese
        const countryFiltered = applyCountryFilter(mappingData, selectedCountries);
        const grouped = groupDataByCountry(countryFiltered);
        const counts = countEntriesByCountry(countryFiltered);
        renderMapWithCounts(counts, grouped);
    }
    updateSelectedFiltersDisplay();
}

function showResultsModal(filteredData) {
    if (filteredData.length === 0) {
        const modal = document.getElementById("db-modal");
        const modalTitle = document.getElementById("modal-country-title");
        const modalList = document.getElementById("modal-db-list");
        modalTitle.textContent = "No datasets found";
        modalList.innerHTML = "<p>No datasets found.</p>";
        modal.classList.add("show");
        return;
    }

    // Raggruppa i risultati per codice ISO2 della nazione
    const grouped = {};
    filteredData.forEach(entry => {
        const countryName = getCountryFromEntry(entry);
        const countryCode = countryNameToISO2[countryName];
        if (!countryCode) return;
        if (!grouped[countryCode]) grouped[countryCode] = [];
        grouped[countryCode].push(entry);
    });

    // Prendi il primo paese nei risultati
    const firstCode = Object.keys(grouped)[0];
    if (!firstCode) return;

    // Salva i risultati nel countryEntryStore
    countryEntryStore[firstCode] = grouped[firstCode];

    // Chiudi il modale se era aperto
    closeDbModal();

    // Mostra i risultati nel pannello laterale usando la funzione principale
    showCountryDetailsInPanel(firstCode);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button.btn-success').forEach(btn => {
        if (btn.textContent.includes("Search")) {
            btn.addEventListener('click', applyFilters);
        }
    });
});

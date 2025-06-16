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
    const match = entry["Country"]?.match(/^([A-Z]{2})\s?\(/);
    if (!match) return null;
    const iso2 = match[1];
    return Object.entries(countryNameToISO2).find(([name, code]) => code === iso2)?.[0] || null;
}

function applyCountryFilter(data, selectedCountries) {
    if (!selectedCountries || selectedCountries.length === 0) return data;
    return data.filter(entry => {
        const countryName = getCountryFromEntry(entry);
        return selectedCountries.includes(countryName);
    });
}

function getSelectedCountries() {
    return [...document.querySelectorAll('input[name="filter-country"]:checked')].map(cb => cb.value);
}

// Ricerca per checkbox (es. Type of Longitudinal Data)
function filterByCheckbox(groupLabel, selectedOptions) {
  const results = jsonData.filter((entry) => {
    return selectedOptions.some((option) => {
      const key = `${groupLabel} [${option}]`;
      return entry[key]?.toLowerCase() === "yes";
    });
  });

  showResultsModal(results, `Filter: ${groupLabel}`);
}

function applyFilters() {
    const filters = getSearchFilters();
    const selectedCountries = getSelectedCountries();

    const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedGroupedFilters = {};

    selectedCheckboxes.forEach(cb => {
        const group = cb.dataset.filter;
        const value = cb.value;
        if (!group || !value) return;
        if (!selectedGroupedFilters[group]) selectedGroupedFilters[group] = [];
        selectedGroupedFilters[group].push(value);
    });

    console.log("✅ Parola chiave:", filters.search);
    console.log("✅ Filtri checkbox:", selectedGroupedFilters);

    const filtered = mappingData.filter(entry => {
        if (selectedCountries.length > 0) {
            const countryMatch = entry.Country?.match(/\(([^)]+)\)/); // prende ciò che è tra parentesi
            const countryName = countryMatch ? countryMatch[1] : "";

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

        // comportamento filtri AND (fa vedere solo i risultati che corrispondono alle ricerche, affina la ricerca)
        const matchesGrouped = Object.entries(selectedGroupedFilters).every(([group, values]) => {
            return values.every(val => {
                const extendedKey = `${group} [${val}]`;
                const simpleKey = group;

                const extendedMatch = entry[extendedKey] && entry[extendedKey].toLowerCase() === "yes";
                const simpleMatch = entry[simpleKey] && entry[simpleKey].toLowerCase() === val.toLowerCase();

                return extendedMatch || simpleMatch;
            });
        });

        // comportamento filtri OR (fa vedere tutti i risultati)
        // const matchesGrouped = Object.entries(selectedGroupedFilters).every(([group, values]) => {
        //     return values.some(val => {
        //         const extendedKey = `${group} [${val}]`;
        //         const simpleKey = group;

        //         // Caso 1: tipo "Sample Level [Limited to specific regions/areas]" = "Yes"
        //         if (entry[extendedKey] && entry[extendedKey].toLowerCase() === "yes") {
        //             return true;
        //         }

        //         // Caso 2: tipo "Sample Level" = "Limited to specific regions/areas"
        //         if (entry[simpleKey] && entry[simpleKey].toLowerCase() === val.toLowerCase()) {
        //             return true;
        //         }

        //         return false;
        //     });
        // });

        return matchesSearch && matchesGrouped;
    });

    // Se c'è testo o checkbox selezionato, mostra modale
    if (filters.search || Object.keys(selectedGroupedFilters).length > 0) {
        showResultsModal(filtered);
    }

    // Altrimenti mostra solo mappa (es. filtri paese)
    let countryFiltered = applyCountryFilter(mappingData, selectedCountries);
    const grouped = groupDataByCountry(countryFiltered);
    const counts = countEntriesByCountry(countryFiltered);
    renderMapWithCounts(counts, grouped);
}

// function applyFilters() {
//     const filters = getSearchFilters();
//     const selectedCountries = getSelectedCountries();

//     // 🔍 FILTRO DI RICERCA TESTUALE + CHECKBOX → solo MODALE
//     const nonCountryFiltersUsed = filters.search || filters.selectedFilters.length > 0;
//     if (nonCountryFiltersUsed) {
//         const filteredData = filterMappingData(mappingData, filters);
//         showResultsModal(filteredData);
//         return; // ⛔ Non aggiornare la mappa
//     }

//     // 🌍 FILTRO "COUNTRY" → aggiorna mappa
//     let filtered = allData;
//     filtered = applyCountryFilter(filtered, selectedCountries);

//     const grouped = groupDataByCountry(filtered);
//     const counts = countEntriesByCountry(filtered);
//     renderMapWithCounts(counts, grouped);
// }

function showResultsModal(filteredData) {
    const modal = document.getElementById("db-modal");
    const modalContent = document.getElementById("modal-db-list");
    const modalTitle = document.getElementById("modal-country-title");

    modalTitle.textContent = "Search Results";
    modalContent.innerHTML = "";
    modal.classList.add("show");

    if (filteredData.length === 0) {
        modalContent.innerHTML = "<p>No datasets found.</p>";
        return;
    }

    filteredData.forEach((entry, index) => {
        const div = document.createElement("div");
        div.className = "db-entry";

        const country = getField(entry, "Country");
        const name = getField(entry, "Name");
        const acronym = getField(entry, "Acronym");
        const description = getField(entry, "Short Description");

        div.innerHTML = `
            <b>Country:</b> ${country}<br>
            <b>Name:</b> ${name}<br>
            <b>Acronym:</b> ${acronym}<br><br>
            ${description}<br>
            <button class="expand-button" onclick="openFilteredDbModal(${index})">Show more</button>
        `;
        modalContent.appendChild(div);
    });

    window.filteredResults = filteredData;
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.btn-success.w-100');
    if (searchBtn) {
        searchBtn.addEventListener('click', applyFilters);
    }
});

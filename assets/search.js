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

function applyFilters() {
    const filters = getSearchFilters();
    const selectedCountries = getSelectedCountries();

    // 🔍 FILTRO DI RICERCA TESTUALE + CHECKBOX → solo MODALE
    const nonCountryFiltersUsed = filters.search || filters.selectedFilters.length > 0;
    if (nonCountryFiltersUsed) {
        const filteredData = filterMappingData(mappingData, filters);
        showResultsModal(filteredData);
        return; // ⛔ Non aggiornare la mappa
    }

    // 🌍 FILTRO "COUNTRY" → aggiorna mappa
    let filtered = allData;
    filtered = applyCountryFilter(filtered, selectedCountries);

    const grouped = groupDataByCountry(filtered);
    const counts = countEntriesByCountry(filtered);
    renderMapWithCounts(counts, grouped);
}

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

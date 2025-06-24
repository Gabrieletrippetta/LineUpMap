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
    const modal = document.getElementById("db-modal");
    const modalTitle = document.getElementById("modal-country-title");
    const modalList = document.getElementById("modal-db-list");

    closeDbModal();  // Pulisce vista precedente
    document.getElementById("toggle-view-button").classList.remove("fixed-top");

    if (filteredData.length === 0) {
        modalTitle.textContent = "No datasets found";
        modalList.innerHTML = "<p>No datasets found.</p>";
        modal.classList.add("show");
        return;
    }

    modalTitle.textContent = `${filteredData.length} dataset${filteredData.length !== 1 ? 's' : ''} for the selected filters`;
    modalList.innerHTML = "";

    filteredData.forEach((entry, index) => {
        const dbDiv = document.createElement("div");
        dbDiv.className = "db-entry";

        const name = getField(entry, "Name");
        const acronym = getField(entry, "Acronym");
        const description = getField(entry, "Short Description");

        const responsibleOrgs = extractBracketedValues(entry, "Responsible Organization [");
        const longitudinalTypes = extractBracketedValues(entry, "Type of Longitudinal Data [");
        const purposesList = extractBracketedValues(entry, "Data Collection Purpose [");
        const focusList = extractBracketedValues(entry, "Data Collection Focus [");

        const frequency = getField(entry, "Data Collection Frequency");
        const duration = getField(entry, "Data Collection Duration (Years)");
        const startingYear = getField(entry, "Starting Year");
        const endingYear = getField(entry, "Ending Year");

        let sampleLevel = getField(entry, "Sample Level");
        if (sampleLevel === "Limited to specific regions/areas") {
            const detail = getField(entry, "Sample Level (Details)");
            sampleLevel = `${sampleLevel}${detail !== "N/A" ? `: ${detail}` : ""}`;
        } else if (sampleLevel === "N/A" || sampleLevel === "") {
            sampleLevel = "N/A";
        }

        dbDiv.innerHTML = `
            <b>Name:</b> ${name}<br>
            <b>Acronym:</b> ${acronym}<br><br>
            ${description}<br><br>

            <b>Responsible Organization(s):</b> ${responsibleOrgs.join(", ") || "N/A"}<br>
            <b>Type of Longitudinal Data:</b> ${longitudinalTypes.join(", ") || "N/A"}<br>
            <b>Purpose of Data Collection:</b> ${purposesList.join(", ") || "N/A"}<br>
            <b>Data Collection Focus:</b> ${focusList.join(", ") || "N/A"}<br>
            <b>Data Collection Frequency:</b> ${frequency}<br>
            <b>Data Collection Duration (Years):</b> ${duration}<br>
            <b>Starting Year:</b> ${startingYear}<br>
            <b>Ending Year:</b> ${endingYear}<br>
            <b>Sample Level:</b> ${sampleLevel}<br>
            <b><a href="#" class="toggle-section" data-target="details-${index}">Show detailed information</a></b><br>
            <div id="details-${index}" class="collapsible-section" style="display:none;">
                <p>[detailed info placeholder]</p>
            </div>

            <b><a href="#" class="toggle-section" data-target="variables-${index}">Show dataset variables</a></b><br>
            <div id="variables-${index}" class="collapsible-section" style="display:none;">
                <p>[variables placeholder]</p>
            </div>

        `;

        modalList.appendChild(dbDiv);
    });

    modal.classList.add("show");
    document.querySelectorAll(".toggle-section").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const targetId = btn.getAttribute("data-target");
            const target = document.getElementById(targetId);

            const isVisible = target.style.display === "block";
            target.style.display = isVisible ? "none" : "block";

            btn.textContent = isVisible
                ? (btn.textContent.includes("detailed") ? "Show detailed information" : "Show dataset variables")
                : (btn.textContent.includes("detailed") ? "Collapse detailed information" : "Collapse dataset variables");
        });
    });

}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button.btn-success').forEach(btn => {
        if (btn.textContent.includes("Search")) {
            btn.addEventListener('click', applyFilters);
        }
    });
});


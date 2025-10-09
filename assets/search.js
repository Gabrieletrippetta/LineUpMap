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
        
        const matchesDropdowns = filters.selectedFilters.length === 0 || filters.selectedFilters.every(val => {
            return Object.values(entry).some(v => v && typeof v === "string" && v.toLowerCase().includes(val.toLowerCase()));
        });
        
        return matchesSearch && matchesDropdowns;
    });
}

function getCountryFromEntry(entry) {
    const raw = entry["Country"];
    if (!raw) return null;
    
    if (raw.includes("BE (Flanders)")) return "Belgium (Flanders)";
    if (raw.includes("BE (Wallonia)")) return "Belgium (Wallonia)";
    
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
            let normalized = "";
            
            if (raw === "UK (England, Wales, Scotland, Northern Ireland)") {
                normalized = "United Kingdom";
            } else {
                const isoMatch = raw?.match(/^([A-Z\/]+)\s?\(/);
                if (isoMatch) {
                    let iso2 = isoMatch[1];
                    if (iso2 === "UK" || iso2 === "GB") iso2 = "UK";
                    normalized = Object.entries(countryNameToISO2).find(([name, code]) =>
                        code === iso2 || iso2.includes(code) || code.includes(iso2)
                )?.[0];
            }
            
            if (!normalized) {
                const nameMatch = raw?.match(/\(([^)]+)\)/);
                if (nameMatch && Object.keys(countryNameToISO2).includes(nameMatch[1])) {
                    normalized = nameMatch[1];
                } else {
                    normalized = raw;
                }
            }
        }
        
        if (!selectedCountries.includes(normalized)) {
            return false;
        }
    }
    
    // 🔍 RICERCA TESTUALE SU TUTTI I CAMPI
    const entryText = Object.values(entry)
    .filter(v => typeof v === "string")
    .join(" ")
    .toLowerCase();
    
    const searchTerms = filters.search.split(/\s+/).filter(Boolean);
    const allTermsMatch = (text) => searchTerms.every(term => text.includes(term));
    
    const matchesSearch = !filters.search || allTermsMatch(entryText);
    
    // filtraggio applicato con values.some (OR)
    const matchesGrouped = Object.entries(selectedGroupedFilters)
    .filter(([group]) => group !== "Country")
    .every(([group, values]) => {
        return values.some(val => {
            const cleanVal = val.replace(/ Data$/, "").toLowerCase();
            // 1. Chiave diretta: group = "Parental Education", val = "for both parents"
            const directVal = entry[group]?.toLowerCase() || "";

            if (group === "Data Collection Frequency") {
                return directVal === cleanVal || directVal.includes(cleanVal);
            }
            
            // 2. Chiave estesa: es. "Parental Education [for both parents]"
            const extendedKey = `${group} [${val}]`;
            const extendedVal = entry[extendedKey]?.toLowerCase() || "";
            
            // 3. Match se valore è "yes", "yes, ...", o contiene la parola chiave
            const directMatch =
            directVal.startsWith("yes") || directVal.includes(val.toLowerCase()) || directVal.includes(cleanVal);
            
            const extendedMatch =
            extendedVal.startsWith("yes") || extendedVal.includes(val.toLowerCase()) || extendedVal.includes(cleanVal);
            
            return directMatch || extendedMatch;
        });
    });
    
    return matchesSearch && matchesGrouped;
});
const grouped = groupDataByCountry(filtered);
const counts = countEntriesByCountry(filtered);
renderMapWithCounts(counts, grouped);

// Altrimenti mostra solo mappa (es. filtri paese)
if (filters.search || Object.keys(selectedGroupedFilters).length > 0) {
    const isListView = document.getElementById("toggle-view-button")?.textContent.includes("Map View");
    
    if (isListView) {
        renderListView(filtered);  // ⚠️ Assicurati che questa funzione esista
    } else {
        showResultsModal(filtered);
    }
} else {
    const countryFiltered = applyCountryFilter(mappingData, selectedCountries);
    const grouped = groupDataByCountry(countryFiltered);
    const counts = countEntriesByCountry(countryFiltered);
    renderMapWithCounts(counts, grouped);
}

updateSelectedFiltersDisplay();

// 📍 Ricentra la mappa a sinistra dello schermo
setTimeout(() => {
    const center = map.getCenter();
    const bounds = map.getBounds();
    const lngSpan = bounds.getEast() - bounds.getWest();

    // Sposta il centro di 1/3 della larghezza verso destra → la mappa apparirà centrata a sinistra
    const newLng = center.lng + (lngSpan / 3);
    map.setView([center.lat, newLng], map.getZoom(), { animate: true });
}, 300);
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
    
    const frequencyOrder = {
        "yearly (or more than once per year)": 1,
        "every other year": 2,
        "every three years": 3,
        "every four year or more": 4
    };

    function normalize(text) {
        return text
            .toLowerCase()
            .replace(/\s+/g, " ")       // rimuove spazi multipli
            .replace(/[’']/g, "'")      // normalizza apostrofi
            .trim();
    }

    filteredData.sort((a, b) => {
        const aFreqRaw = a["Data Collection Frequency"] || "";
        const bFreqRaw = b["Data Collection Frequency"] || "";

        const aFreqNorm = normalize(aFreqRaw);
        const bFreqNorm = normalize(bFreqRaw);

        const aVal = frequencyOrder[aFreqNorm] || 99;
        const bVal = frequencyOrder[bFreqNorm] || 99;

        return aVal - bVal;
    });

    filteredData.forEach((entry, index) => {
        const dbDiv = document.createElement("div");
        dbDiv.className = "db-entry";
        
        const name = getField(entry, "Name");
        const acronym = getField(entry, "Acronym");
        const description = getField(entry, "Short Description");
        
        const responsibleOrgs = extractBracketedValues(entry, "Responsible Organization [");
        const longitudinalStructure = getField(entry, "Longitudinal Data Structure");
        const longitudinalTypes = getField(entry, "Type of Longitudinal Data");
        const purposesList = extractBracketedValues(entry, "Data Collection Purpose [");
        const focusList = extractBracketedValues(entry, "Data Collection Focus [");
        
        const frequency = getField(entry, "Data Collection Frequency");
        // const duration = getField(entry, "Data Collection Duration (Years)");
        const startingYear = getField(entry, "Starting Year");
        const endingYear = getField(entry, "Ending Year");
        
        const ecec = getField(entry, "Information on ECEC or Pre-Primary Education");
        const includedGrades = extractBracketedValues(entry, "School Grades Included [");
        const afterSchool = getField(entry, "Students Followed After School Education")
        
        let skills = extractBracketedValues(entry, "Type of Skills Analysed [");
        const otherDetails = getField(entry, "Other Skills (Details)");

        skills = skills.map(skill => {
            if (skill.toLowerCase() === "other skills" && otherDetails && otherDetails !== "N/A") {
                return `Other Skills: ${otherDetails.replace(/;/g, ", ")}`;
            }
            return skill;
        });
        const measureTypes = extractBracketedValues(entry, "Measure Type [");
        const adminMethod = getField(entry, "Administration Method");
        
        const sampleTypes = extractBracketedValues(entry, "Sample Type [");
        const samplingCriteria = getField(entry, "Sampling Weights/Criteria");

        const showSamplingCriteria = sampleTypes.some(t =>
            t.toLowerCase() === "non-random students' sample" || t.toLowerCase() === "other"
        );

        const sampleSize = getField(entry, "Average Sample Size x Wave");
        const sampleUnits = extractBracketedValues(entry, "Sample Unit [");
        
        const linkability = extractBracketedValues(entry, "Data Linkability At Individual Level [");
        const linkabilityRaw = getField(entry, "Data Linkability At Individual Level");
        
        const microdata = getField(entry, "Access to Micro Data");
        const constraints = getField(entry, "Constraints for Data Download and Management");
        const website = getField(entry, "Official Website");
        
        const advancedInfo = `
        <h3 class="mt-4">Detailed information</h3>
        <div class="accordion" id="advancedInfo-${index}">
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#school-${index}">School Grades</button>
                </h2>
                <div id="school-${index}" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        <p><strong>ECEC:</strong> ${ecec}</p>
                        <p><strong>Included Grades:</strong></p>
                        <ul>${includedGrades.map(g => `<li>${g}</li>`).join("") || "<li>None</li>"}</ul>
                        <p><strong>Students followed after school education:</strong> ${afterSchool}</p>
                    </div>
                </div>
            </div>
        
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#skills-${index}">Students’ Skills and Achievement</button>
                </h2>
                <div id="skills-${index}" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        <p><strong>Skills Analysed:</strong> ${skills.join(", ") || "N/A"}</p>
                        <p><strong>Measure Types:</strong> ${measureTypes.join(", ") || "N/A"}</p>
                        <p><strong>Administration Method:</strong> ${adminMethod}</p>
                    </div>
                </div>
            </div>
        
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sample-${index}">Sample</button>
                </h2>
                <div id="sample-${index}" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        <p><strong>Sample Types:</strong> ${sampleTypes.join(", ") || "N/A"}</p>
                        ${showSamplingCriteria && samplingCriteria !== "N/A" ? `<p><strong>Sampling Weights/Criteria:</strong> ${samplingCriteria}</p>` : ""}

                        <p><strong>Avg Sample Size x Wave:</strong> ${sampleSize}</p>
                        <p><strong>Sample Units:</strong> ${sampleUnits.join(", ") || "N/A"}</p>
                    </div>
                </div>
            </div>
        
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#linkability-${index}">Linkability</button>
                </h2>
                <div id="linkability-${index}" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        <p><strong>Linkability:</strong> ${linkabilityRaw}</p>
                        <p><strong>Details:</strong> ${linkability.join(", ") || "N/A"}</p>
                    </div>
                </div>
            </div>
        
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accessibility-${index}">Accessibility</button>
                </h2>
                <div id="accessibility-${index}" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        <p><strong>Access to Microdata:</strong> ${microdata}</p>
                        <p><strong>Constraints:</strong> ${constraints}</p>
                        <p><strong>Website:</strong> <a href="${website}" target="_blank">${website}</a></p>
                    </div>
                </div>
            </div>
        </div>`;
        
        const variablesInfo = (entry) => {
            const sections = {
                "Students’ Information": [
                    "Student Gender", "Student Age", "Student Citizenship", "Student Foreign Birth Country", "Student Specific Birth Country",
                    "Student Town of Residence", "Student Province of Residence", "Student Region of Residence", "Student Belonging to a Recognised Ethnic Minority",
                    "Student ECEC Attendance", "Student Previous Grade Retention", "Student Learning Impairments", "Student Physical Impairments",
                    "Student School Attitude or Motivation", "Student Assigned Teacher Grades", "Student Allowance/Scholarship", "Student Information Type"
                ],
                "Household’s Information": [
                    "Number of Parents", "Presence of Stepparents", "Siblings", "Parental Working Status", "Parental Occupation", "Parental Education",
                    "Parental Education Level (ISCED)", "Parental Migratory Background", "Parents Age", "Parents Place Of Birth",
                    "Parental Income or Wealth", "Parental Host Country's Language Proficiency", "Number of Books", "Number of Digital Devices",
                    "Ownership of the Apartment/House", "Household Information Type"
                ],
                "Teachers’ Information": [
                    "Teacher Age", "Teacher Gender", "Teacher Seniority", "Teacher Educational Degree", "Teacher Contract Type",
                    "Teacher Information Type", "Teacher Information Linkability"
                ],
                "School/Class Information": [
                    "School Geo-Referencing", "School Type", "School Track", "School Size", "Class Size",
                    "School Composition", "Class Composition"
                ]
            };
            
            const createSection = (title, keys) => {
                const items = keys.map(key => {
                    const val = entry[key];
                    if (val && typeof val === "string" && val.trim() !== "") {
                        return `<li><strong>${key}:</strong> ${val}</li>`;
                    }
                    return null;
                }).filter(Boolean).join("");
                
                if (!items) return "";
                
                return `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapse-${title.replace(/\W/g, '')}">
                            ${title}
                        </button>
                    </h2>
                    <div id="collapse-${title.replace(/\W/g, '')}" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <ul>${items}</ul>
                        </div>
                    </div>
                </div>
            `;
            };
            
            return `
        <div class="accordion mt-3" id="variablesAccordion">
        ${Object.entries(sections).map(([title, keys]) => createSection(title, keys)).join("")}
        </div>
        `;
            
        };
        
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
            <b>Longitudinal Data Structure:</b> ${longitudinalStructure || "N/A"} Data<br>
            <b>Type of Longitudinal Data:</b> ${longitudinalTypes || "N/A"} Data<br>
            <b>Purpose of Data Collection:</b> ${purposesList.join(", ") || "N/A"}<br>
            <b>Data Collection Focus:</b> ${focusList.join(", ") || "N/A"}<br>
            <b>Data Collection Frequency:</b> ${frequency}<br>
            <b>Starting Year:</b> ${startingYear}<br>
            <b>Ending Year:</b> ${endingYear}<br>
            <b>Sample Level:</b> ${sampleLevel}<br>

            <button type-button class="btn btn-secondary btn-sm mt-2 mr-4 popout" onclick="popoutDataset('${getCountryFromEntry(entry)}', ${index})">&#x2197; Popout</button>

            <div id="details-${index}" class="collapse">
                ${advancedInfo}
            </div>
        
            <button type="button" class="btn btn-success btn-sm toggle-collapse-btn mt-2"
                    data-bs-toggle="collapse"
                    data-bs-target="#details-${index}"
                    aria-expanded="false"
                    aria-controls="details-${index}">
                Show detailed information
            </button>
        
            <div id="variables-${index}" class="collapse">
                <h3 class="mt-4">Dataset Variables</h3>
                ${variablesInfo(entry)}
            </div>
        
            <button type="button" class="btn btn-success btn-sm var-toggle-collapse-btn mt-2"
                    data-bs-toggle="collapse"
                    data-bs-target="#variables-${index}"
                    aria-expanded="false"
                    aria-controls="variables-${index}">
                Show dataset variables
            </button>
        
        `;
        
        modalList.appendChild(dbDiv);
        const collapseBtn = dbDiv.querySelector('.toggle-collapse-btn');
        const collapseId = collapseBtn.getAttribute('data-bs-target');
        const collapseEl = dbDiv.querySelector(collapseId);
        
        if (collapseEl) {
            collapseEl.addEventListener('show.bs.collapse', () => {
                collapseBtn.textContent = 'Collapse detailed information';
            });
            
            collapseEl.addEventListener('hide.bs.collapse', () => {
                collapseBtn.textContent = 'Show detailed information';
            });
        }
        
        const collapseVarBtn = dbDiv.querySelector('.var-toggle-collapse-btn');
        const collapseVarId = collapseVarBtn.getAttribute('data-bs-target');
        const collapseVarEl = dbDiv.querySelector(collapseVarId);
        
        if (collapseVarEl) {
            collapseVarEl.addEventListener('show.bs.collapse', () => {
                collapseVarBtn.textContent = 'Collapse dataset variables';
            });
            
            collapseVarEl.addEventListener('hide.bs.collapse', () => {
                collapseVarBtn.textContent = 'Show dataset variables';
            });
        }
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



function getField(entry, ...possibleKeys) {
    for (let key of possibleKeys) {
        for (let actualKey of Object.keys(entry)) {
            if (actualKey.trim().toLowerCase() === key.trim().toLowerCase()) {
                const val = entry[actualKey];
                if (val && val !== "-" && val !== "null") return val;
            }
        }
    }
    return "N/A";
}

let previousModalState = null;
//! SCELTA DELL'UTENTE

// const roleDescriptions = {
//     stakeholder: "(including policymakers, institutions, NGOs, and ministries of education) interested in accessible insights and research findings derived from longitudinal data on school education.",
//     researcher: "(including data analysts) interested in the datasets themselves for deeper statistical analysis and academic studies."
// };

// function updateRoleDisplay(role) {
//     const roleSpan = document.getElementById("current-role");
//     const roleBox = document.getElementById("role-description-box");

//     console.log("updateRoleDisplay() chiamato con:", role);

//     if (role === "stakeholder") {
//         roleSpan.innerText = "Educational Stakeholder";
//         roleBox.innerText = roleDescriptions.stakeholder;
//     } else if (role === "researcher") {
//         roleSpan.innerText = "Researcher";
//         roleBox.innerText = roleDescriptions.researcher;
//     }
// }

// function showRoleDescription() {
//     document.getElementById("role-description-box").style.display = "block";
// }

// function hideRoleDescription() {
//     document.getElementById("role-description-box").style.display = "none";
// }

// function changeRole() {
//     document.getElementById("role-modal").style.display = "flex";
// }

// function selectRole(role) {
//     localStorage.setItem("userRole", role);
//     document.getElementById("role-modal").style.display = "none";
//     document.getElementById("role-display-container").style.display = "block";
//     updateRoleDisplay(role);
// }

function populateCountryFilter() {
    const container = document.getElementById("main-filter-labels");
    const countries = new Set();
    
    mappingData.forEach(entry => {
        const match = entry["Country"]?.match(/\(([^)]+)\)/);
        if (match) countries.add(match[1]);
    });
    
    const html = [...countries].sort().map(country => {
        return `<label><input type="checkbox" name="filter-country" value="${country}"> ${country}</label>`;
    }).join("<br>");
    
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    container.appendChild(wrapper);
}

// MAPPA

var currentZoom = 3;
var map = L.map('map', {
    center: [54.5260, 14.5551],
    zoom: currentZoom,
    minZoom: 4.2,
    worldCopyJump: false,
    zoomControl: false,
    maxBounds: [
        [15, -40],  // Sud-ovest (lat, lon)
        [80, 80]    // Nord-est (lat, lon)
    ],
    maxBoundsViscosity: 1.0
});
// var map = L.map('map').setView([54.5260, 14.5551], 4.4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// var countries = { "AT": [47.5162, 14.5501], "BE": [50.6203, 4.3517], "BG": [42.7339, 25.4858], "HR": [43.6, 15.2], "CY": [35.1264, 33.4299], "CZ": [49.8175, 15.4729], "DK": [56.2639, 9.5018], "EE": [58.5953, 25.0136], "FI": [61.9241, 25.7482], "FR": [46.6034, 1.8883], "DE": [51.1657, 10.4515], "GR": [39.0742, 21.8243], "HU": [47.1625, 19.5033], "IE": [53.4129, -8.2439], "IT": [41.8719, 12.5674], "LV": [56.8796, 24.6032], "LT": [55.1694, 23.8813], "LU": [49.5153, 6.1296], "MT": [35.9375, 14.3754], "NL": [52.1326, 5.2913], "PL": [51.9194, 19.1451], "PT": [39.3999, -8.2245], "RO": [45.9432, 24.9668], "SK": [48.669, 19.699], "SI": [46.1512, 14.9955], "ES": [40.4637, -3.7492], "SE": [60.1282, 16.0435], "IS": [64.9631, -19.0208], "LI": [47.166, 9.5554], "NO": [60.472, 8.4689], "CH": [46.8182, 7.2275], "GB": [53.3781, -1.436] };

var countries = {
    "Austria": [47.5162, 14.5501],
    "Belgium (Flanders)": [50.8798, 3.85],
    "Belgium (Wallonia)": [50.4669, 4.8675],
    "Bulgaria": [42.7339, 25.4858],
    "Croatia": [44.402, 15.581],
    "Cyprus": [35.1264, 33.4299],
    "Czech Republic": [49.8175, 15.4729],
    "Denmark": [56.2639, 9.5018],
    "Estonia": [58.5953, 25.0136],
    "Finland": [61.9241, 25.7482],
    "France": [46.6034, 1.8883],
    "Germany": [51.1657, 10.4515],
    "Greece": [39.0742, 21.8243],
    "Hungary": [47.1625, 19.5033],
    "Ireland": [53.4129, -8.2439],
    "Italy": [41.8719, 12.5674],
    "Latvia": [56.8796, 24.6032],
    "Lithuania": [55.1694, 23.8813],
    "Luxembourg": [49.5153, 6.1296],
    "Malta": [35.9375, 14.3754],
    "Netherlands": [52.1326, 5.2913],
    "Poland": [51.9194, 19.1451],
    "Portugal": [39.3999, -8.2245],
    "Romania": [45.9432, 24.9668],
    "Slovakia": [48.669, 19.699],
    "Slovenia": [46.1512, 14.9955],
    "Spain": [40.4637, -3.7492],
    "Sweden": [60.1282, 16.0435],
    "Iceland": [64.9631, -19.0208],
    "Liechtenstein": [47.166, 9.5554],
    "Norway": [60.472, 8.4689],
    "Switzerland": [46.8182, 7.2275],
    "United Kingdom": [53.3781, -1.436]
};

const countryNameToISO2 = {
    "Austria": "AT",
    "Belgium (Flanders)": "BE-FL",
    "Belgium (Wallonia)": "BE-WA",
    "Bulgaria": "BG",
    "Croatia": "HR",
    "Cyprus": "CY",
    "Czech Republic": "CZ",
    "Denmark": "DK",
    "Estonia": "EE",
    "Finland": "FI",
    "France": "FR",
    "Germany": "DE",
    "Greece": "EL",
    "Hungary": "HU",
    "Ireland": "IE",
    "Italy": "IT",
    "Latvia": "LV",
    "Lithuania": "LT",
    "Luxembourg": "LU",
    "Malta": "MT",
    "Netherlands": "NL",
    "Poland": "PL",
    "Portugal": "PT",
    "Romania": "RO",
    "Slovakia": "SK",
    "Slovenia": "SI",
    "Spain": "ES",
    "Sweden": "SE",
    "Iceland": "IS",
    "Liechtenstein": "LI",
    "Norway": "NO",
    "Switzerland": "CH",
    "United Kingdom": "UK"
};

const colorPalette = [
    '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#0a007f',
    '#ffff33', '#a65628', '#f781bf', '#999999', '#66c2a5',
    '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#00d92f',
    '#e5c494', '#b3b3b3', '#1b9e77', '#d95f02', '#7570b3',
    '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666',
    '#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99',
    '#e31a1c', '#fdbf6f', '#00b2d6', '#6a3d9a', '#ff7f00',
    '#ffff99', '#b15928'
];

const countryColors = {};
let colorIndex = 0;

function assignUniqueColor(isoCode) {
    if (!countryColors[isoCode]) {
        countryColors[isoCode] = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;
    }
    return countryColors[isoCode];
}

function drawAllCountriesColored() {
    Object.entries(countryBorders).forEach(([iso2, feature]) => {
        const color = assignUniqueColor(iso2);
        
        L.geoJSON(feature, {
            style: {
                color: '#444',
                weight: 1,
                fillColor: color,
                fillOpacity: 0.5
            }
        }).addTo(map);
    });
}

var markers = {};

Object.keys(countries).forEach(country => {
    var customIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
});

function countEntriesByCountry(data) {
    const counts = {};
    Object.keys(countries).forEach(name => counts[name] = 0);
    
    data.forEach(row => {
        const match = row["Country"]?.match(/^([A-Z\/]+)\s?\(/);
        if (match) {
            const iso2 = match[1];
            const countryName = Object.entries(countryNameToISO2).find(([name, code]) => code === iso2 || iso2.includes(code) || code.includes(iso2))?.[0];
            
            if (countryName) {
                counts[countryName]++;
            }
        }
    });
    
    return counts;
}

function groupDataByCountry(data) {
    const grouped = {};
    Object.keys(countries).forEach(name => grouped[name] = []);
    
    data.forEach(row => {
        const raw = row["Country"]?.trim();
        
        // 🎯 Gestione Flanders e Wallonia
        if (row["Country"]?.includes("BE (Flanders)")) {
            grouped["Belgium (Flanders)"].push(row);
            return;
        }
        if (row["Country"]?.includes("BE (Wallonia)")) {
            grouped["Belgium (Wallonia)"].push(row);
            return;
        }
        let matchedCountry = null;
        
        // 🇬🇧 UK eccezione
        if (raw === "UK (England, Wales, Scotland, Northern Ireland)") {
            matchedCountry = "United Kingdom";
        }
        
        // Estrai ISO e cerca
        if (!matchedCountry) {
            const isoMatch = raw?.match(/^([A-Z\/]+)\s?\(/);
            if (isoMatch) {
                let iso2 = isoMatch[1];
                if (iso2 === "UK") iso2 = "GB";
                matchedCountry = Object.entries(countryNameToISO2).find(([name, code]) =>
                    code === iso2 || iso2.includes(code) || code.includes(iso2)
            )?.[0];
        }
    }
    
    // Match tramite nome
    if (!matchedCountry) {
        const nameMatch = raw?.match(/\(([^)]+)\)/);
        if (nameMatch && Object.keys(countries).includes(nameMatch[1])) {
            matchedCountry = nameMatch[1];
        }
    }
    
    // Fallback
    if (!matchedCountry && Object.keys(countries).includes(raw)) {
        matchedCountry = raw;
    }
    
    if (matchedCountry && grouped[matchedCountry]) {
        grouped[matchedCountry].push(row);
    } else if (!matchedCountry) {
        console.warn("Nessun paese trovato per:", raw);
    }
    
});

return grouped;
}


const countryEntryStore = {};  // Variabile globale

function renderMapWithCounts(counts, groupedData) {
    // Rimuove tutti i marker esistenti
    Object.values(markers).forEach(marker => map.removeLayer(marker));
    markers = {};
    
    const sortedCountries = Object.keys(countries).sort();
    
    sortedCountries.forEach(code => {
        const count = counts[code] || 0;
        const latlng = countries[code];
        
        const pinColor = count > 0 ? "#007bff" : "#999999";
        
        const iconHtml = `
            <div class="svg-pin">
            <svg width="40" height="50" viewBox="0 0 24 24" fill="${pinColor}" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            <span class="pin-count">${count}</span>
            </div>`;
        
        const icon = L.divIcon({
            className: '',
            html: iconHtml,
            iconSize: [40, 50],
            iconAnchor: [20, 50]
        });
        
        if (markers[code]) map.removeLayer(markers[code]);
        
        const marker = L.marker(latlng, { icon }).addTo(map);
        markers[code] = marker;
        
        const entries = (groupedData[code] || []).slice();
        
        // Ordina i dataset per "Name"
        entries.sort((a, b) => {
            const nameA = getField(a, "Name").toLowerCase();
            const nameB = getField(b, "Name").toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        countryEntryStore[code] = entries;  // 🔒 Salva dati per uso nei click handler
        
        let popupContent = `<p class="popup-country">Datasets in <b>${code}</b></p>`;
        
        if (entries.length === 0) {
            popupContent += `<i>No data available</i>`;
        } else {
            popupContent += `<div id="entryList-${code}" style="display: block;">`;
            
            entries.slice(0, 3).forEach((e, i) => {
                const name = getField(e, "Name");
                const acronym = getField(e, "Acronym");
                const encodedCode = encodeURIComponent(code);
                
                popupContent += `
                    <div class="entry-preview">
                        <strong>Name: </strong><span>${name}</span><br>
                        <strong>Acronym: </strong><i>${acronym}</i><br>
                        <div style="text-align: right;">
                            <button class="expand-button" onclick="openSingleDbModal('${encodedCode}', ${i})">
                                Show more
                            </button>
                        </div>
                    </div><hr>`;
            });
            
            popupContent += `</div>`;
            
            if (entries.length > 3) {
                const encodedCode = encodeURIComponent(code);
                popupContent += `
            <div class="popup-buttons">
                <button class="show-button" onclick="zoomToCountry('${encodedCode}'); openDbModal('${encodedCode}')">
                    Show all datasets (${count})
                </button>
            </div>
        `;
            }
        }
        
        
        marker.bindPopup(popupContent);
        marker.on("click", () => marker.openPopup());
    });
    
    // console.log("COUNTS:", counts);
    // console.log("GROUPED:", groupedData);
}

function toggleEntries(code, encodedEntries, showAll) {
    const entries = JSON.parse(decodeURIComponent(encodedEntries));
    const list = document.getElementById(`entryList-${code}`);
    const showBtn = document.getElementById(`showMore-${code}`);
    const hideBtn = document.getElementById(`hideMore-${code}`);
    
    list.innerHTML = "";
    if (showAll) {
        entries.forEach(e => {
            list.innerHTML += `
                <div>
                    <b>${getField(e, "Name")}</b><br>
                    <i>${getField(e, "Acronym")}</i><br>
                </div><hr>`;
        });
        showBtn.style.display = "none";
        hideBtn.style.display = "inline-block";
    } else {
        entries.slice(0, 3).forEach(e => {
            list.innerHTML += `
                <div>
                    <b>${getField(e, "Name")}</b><br>
                    <i>${getField(e, "Acronym")}</i><br>
                </div><hr>`;
        });
        showBtn.style.display = "inline-block";
        hideBtn.style.display = "none";
    }
}

let mappingData = null;
let geojsonLoaded = false;

fetch("./assets/europe.geojson")
.then(res => {
    if (!res.ok) throw new Error("Errore nel caricamento di europe.geojson");
    return res.json();
})
.then(data => {
    console.log("GeoJSON caricato", data);
    data.features.forEach(f => {
        const code = f.properties.ISO2;
        countryBorders[code] = f;
    });
    console.log("Confini caricati per codici ISO_A2:", Object.keys(countryBorders));
    geojsonLoaded = true;
    checkIfReady();
    if (mappingData) {
        console.log("Chiamo initMap da geojson");
        initMap();
    }
    drawAllCountriesColored();
})
.catch(err => console.error("Errore nel caricamento dei confini:", err));

document.addEventListener("DOMContentLoaded", () => {
    fetch("./data/mapping_data.json")
    .then(response => {
        if (!response.ok) throw new Error("Errore nel caricamento di mapping_data.json");
        return response.json();
    })
    .then(data => {
        console.log("Mapping data caricato", data);
        mappingData = data;
        populateCountryFilter();
        window.filteredDataForSearch = data;
        checkIfReady();
        setupMainFilterInteraction(mappingData);
        setupAdvancedFilterInteraction(mappingData);
        setupDataVariablesInteraction(mappingData);
        // setupVariablesFilterInteraction(mappingData);
        //   setupMainFilterDropdownToggle();
        // ✅ Imposta il placeholder dinamico nel campo di ricerca
        const searchInput = document.getElementById("search-input");
        if (searchInput && searchInput.value.trim() === "") {
            searchInput.placeholder = `Search among ${mappingData.length} datasets`;
        }
        if (geojsonLoaded) {
            console.log("Chiamo initMap da mappingData");
            initMap();
        }
    })
    .catch(error => console.error("Errore nel caricamento dei dati mappa:", error));
    window.mappingDataReady = true;
});


function initMap() {
    const countryCounts = countEntriesByCountry(mappingData);
    const grouped = groupDataByCountry(mappingData);
    renderMapWithCounts(countryCounts, grouped);
    setupMainFilterInteraction(mappingData);
    setupAdvancedFilterInteraction(mappingData);
    setupDataVariablesInteraction(mappingData);
    // setupVariablesFilterInteraction(mappingData);
    Object.entries(countryNameToISO2).forEach(([country, iso2]) => {
        const color = countryColors[iso2];
        console.log(`${country} (${iso2}): ${color}`);
    });
}

// EXTRACT IN SQUARE BRACKETS CONTENT
function extractBracketedValues(entry, prefix) {
    const result = [];
    for (const key in entry) {
        if (key.startsWith(prefix) && entry[key].trim().toLowerCase() === "yes") {
            const match = key.match(/\[([^\]]+)\]/);
            if (match) result.push(match[1]);
        }
    }
    return result;
}

// SHOW REALLY BASIC INFO ON DB

function openDbModal(code) {
    previousModalState = null;
    const decodedCode = decodeURIComponent(code);
    let normalizedCode = decodedCode;
    
    // Normalizza eventuali sinonimi noti
    if (decodedCode === "UK" || decodedCode.includes("England")) {
        normalizedCode = "United Kingdom";
    }
    
    const panelEntries = countryEntryStore[normalizedCode] || [];
    const modal = document.getElementById("db-modal");
    const title = document.getElementById("modal-country-title");
    const container = document.getElementById("modal-db-list");
    
    const readableCode = decodeURIComponent(code);
    title.textContent = `${panelEntries.length} dataset${panelEntries.length !== 1 ? 's' : ''} in ${readableCode}`;
    container.innerHTML = "";
    
    document.getElementById("toggle-view-button").classList.add("fixed-top");
    
    const role = localStorage.getItem("userRole");
    console.log("Ruolo scelto: ", role);
    
    panelEntries.forEach((entry, index) => {
        const dbDiv = document.createElement("div");
        dbDiv.className = "db-entry";
        
        const name = getField(entry, "Name");
        const acronym = getField(entry, "Acronym");
        const description = getField(entry, "Short Description");
        
        dbDiv.innerHTML = `
            <b>Name:</b> ${name}<br>
            <b>Acronym:</b> ${acronym}<br>
            ${description}<br><br>
            <div style="text-align: right;">
                <button class="expand-button" onclick="openSingleDbModal('${readableCode}', ${index})">Show more</button>
            </div>
            `;
        
        container.appendChild(dbDiv);
        console.log("Appended entry:", dbDiv);
    });
    
    closeDbPanel();
    modal.classList.add("show");
}

// SHOW ALL DATASET PANEL

function showCountryDetailsInPanel(code) {
    const decodedCode = decodeURIComponent(code);
    let normalizedCode = decodedCode;
    
    // Normalizza eventuali sinonimi noti
    if (decodedCode === "UK" || decodedCode.includes("England")) {
        normalizedCode = "United Kingdom";
    }
    
    const panelEntries = countryEntryStore[normalizedCode] || [];
    const panel = document.getElementById("db-modal");
    const title = document.getElementById("modal-country-title");
    const content = document.getElementById("modal-db-list");
    
    const readableCode = decodeURIComponent(code);
    title.textContent = `${panelEntries.length} dataset${panelEntries.length !== 1 ? 's' : ''} in ${readableCode}`;
    
    content.innerHTML = "";
    
    document.getElementById("toggle-view-button").classList.add("fixed-top");
    
    panelEntries.forEach((entry, index) => {
        const name = getField(entry, "Name");
        const acronym = getField(entry, "Acronym");
        const description = getField(entry, "Short Description");
        
        const responsibleOrgs = extractBracketedValues(entry, "Responsible Organization [");
        const allLongitudinalTypes = extractBracketedValues(entry, "Type of Longitudinal Data [");
        const longitudinalTypes = allLongitudinalTypes.filter(type => type !== "Hybrid Data");
        const purposesList = extractBracketedValues(entry, "Data Collection Purpose [");
        const focusList = extractBracketedValues(entry, "Data Collection Focus [");
        
        const frequency = getField(entry, "Data Collection Frequency");
        const startingYear = getField(entry, "Starting Year");
        const endingYear = getField(entry, "Ending Year");
        
        const ecec = getField(entry, "Information on ECEC or Pre-Primary Education");
        const includedGrades = extractBracketedValues(entry, "School Grades Included [");
        // const primarySecondary = getField(entry, "Data Collection on Both Primary and Secondary Education");
        const afterSchool = getField(entry, "Students Followed After School Education")
        
        const skills = extractBracketedValues(entry, "Type of Skills Analysed [");
        const measureTypes = extractBracketedValues(entry, "Measure Type [");
        const adminMethod = getField(entry, "Administration Method");
        
        const sampleTypes = extractBracketedValues(entry, "Sample Type [");
        const samplingCriteria = getField(entry, "Sampling Weights/Criteria");
        const sampleSize = getField(entry, "Average Sample Size x Wave");
        const sampleUnits = extractBracketedValues(entry, "Sample Unit [");
        
        const linkability = extractBracketedValues(entry, "Data Linkability At Individual Level [");
        const linkabilityRaw = getField(entry, "Data Linkability At Individual Level");
        
        const microdata = getField(entry, "Access to Micro Data");
        const constraints = getField(entry, "Constraints for Data Download and Management");
        const website = getField(entry, "Official Website");
        
        const advancedInfo = `
        <h3>Detailed information</h3>
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
                        ${sampleTypes.some(type => ["Non-Random Students’ Sample", "Other"].includes(type)) ? `<p><strong>Sampling Weights/Criteria:</strong> ${samplingCriteria}</p>` : ""}
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
                    "Student School Attitude or Motivation", "Student Assigned Teacher Grades", "Student Allowance/Scholarship"
                ],
                "Household’s Information": [
                    "Number of Parents", "Presence of Stepparents", "Siblings", "Parental Working Status", "Parental Occupation", "Parental Education",
                    "Parental Education Level (ISCED)", "Parental Migratory Background", "Parents Age", "Parents Place Of Birth",
                    "Parental Income or Wealth", "Parental Host Country's Language Proficiency", "Number of Books", "Number of Digital Devices",
                    "Ownership of the Apartment/House"
                ],
                "Teachers’ Information": [
                    "Teacher Age", "Teacher Gender", "Teacher Seniority", "Teacher Educational Degree", "Teacher Contract Type"
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
        
        
        const entryDiv = document.createElement("div");
        entryDiv.innerHTML = `
            <b>Name:</b> ${name}<br>
            <b>Acronym:</b> ${acronym}<br><br>
            ${description}<br><br>
        
            <b>Responsible Organization(s):</b> ${responsibleOrgs.join(", ") || "N/A"}<br>
            <b>Type of Longitudinal Data:</b> ${longitudinalTypes.join(", ") || "N/A"}<br>
            <b>Purpose of Data Collection:</b> ${purposesList.join(", ") || "N/A"}<br>
            <b>Data Collection Focus:</b> ${focusList.join(", ") || "N/A"}<br>
            <b>Data Collection Frequency:</b> ${frequency}<br>
            <b>Starting Year:</b> ${startingYear}<br>
            <b>Ending Year:</b> ${endingYear}<br>
            <b>Sample Level:</b> ${sampleLevel}<br>
        
            <button type-button class="btn btn-secondary btn-sm mt-2" onclick="popoutDataset('${readableCode}', ${index})">&#x2197; Popout</button>
        
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
                <h3 class="mt-3">Dataset Variables</h3>
                ${variablesInfo(entry)}
            </div>
        
            <button type="button" class="btn btn-success btn-sm var-toggle-collapse-btn mt-2"
                data-bs-toggle="collapse"
                data-bs-target="#variables-${index}"
                aria-expanded="false"
                aria-controls="variables-${index}">
                Show dataset variables
            </button>
            
            <hr>
        `;
        
        // Subito dopo aver impostato innerHTML
        const collapseBtn = entryDiv.querySelector('.toggle-collapse-btn');
        const collapseId = collapseBtn.getAttribute('data-bs-target');
        const collapseEl = entryDiv.querySelector(collapseId);
        
        if (collapseEl) {
            collapseEl.addEventListener('show.bs.collapse', () => {
                collapseBtn.textContent = 'Collapse detailed information';
            });
            
            collapseEl.addEventListener('hide.bs.collapse', () => {
                collapseBtn.textContent = 'Show detailed information';
            });
        }
        const collapseVarBtn = entryDiv.querySelector('.var-toggle-collapse-btn');
        const collapseVarId = collapseVarBtn.getAttribute('data-bs-target');
        const collapseVarEl = entryDiv.querySelector(collapseVarId);
        
        if (collapseVarEl) {
            collapseVarEl.addEventListener('show.bs.collapse', () => {
                collapseVarBtn.textContent = 'Collapse dataset variables';
            });
            
            collapseVarEl.addEventListener('hide.bs.collapse', () => {
                collapseVarBtn.textContent = 'Show dataset variables';
            });
        }
        content.appendChild(entryDiv);
    });
    
    closeDbModal();
    panel.classList.add("show");
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

function getIncludedGrades(entry) {
    const included = [];
    Object.keys(entry).forEach(key => {
        if (key.startsWith("School Grades Included [") && entry[key].trim().toLowerCase() === "yes") {
            const match = key.match(/\[([^\]]+)\]/);
            if (match) included.push(match[1]);
        }
    });
    return included;
}

function stampaCoppieChiaveValore(prefix, entry) {
    return Object.entries(entry)
    .filter(([key, val]) => key.startsWith(prefix + " [") && val.trim().toLowerCase() === "yes")
    .map(([key]) => {
        const label = key.match(/\[([^\]]+)\]/);
        return `<p><strong>${label ? label[1] : key}:</strong> Yes</p>`;
    }).join("");
}


function closeDbPanel() {
    document.getElementById("dbpanel").classList.remove("show");
    document.getElementById("toggle-view-button").classList.remove("fixed-top");
}


function closeDbModal() {
    document.getElementById("db-modal").classList.remove("show");
    document.getElementById("toggle-view-button").classList.remove("fixed-top");
    
    // Rimuove evidenziazione confine
    if (highlightedLayer) {
        map.removeLayer(highlightedLayer);
        highlightedLayer = null;
    }
    
    // Torna alla vista iniziale della mappa (Europa)
    map.setView([54.5260, 14.5551], 4.4);
}

function openSingleDbModal(code, index) {
    previousModalState = { type: "country", code };
    const decodedCode = decodeURIComponent(code);
    let normalizedCode = decodedCode;
    
    // Normalizza eventuali sinonimi noti
    if (decodedCode === "UK" || decodedCode.includes("England")) {
        normalizedCode = "United Kingdom";
    }
    
    const panelEntries = countryEntryStore[normalizedCode] || [];
    const entry = panelEntries[index];
    if (!entry) return;
    
    const panel = document.getElementById("db-modal");
    const title = document.getElementById("modal-country-title");
    const content = document.getElementById("modal-db-list");
    
    title.textContent = "Dataset details";
    content.innerHTML = "";
    document.getElementById("toggle-view-button").classList.add("fixed-top");
    
    const name = getField(entry, "Name");
    const acronym = getField(entry, "Acronym");
    const description = getField(entry, "Short Description");
    
    const responsibleOrgs = extractBracketedValues(entry, "Responsible Organization [");
    const allLongitudinalTypes = extractBracketedValues(entry, "Type of Longitudinal Data [");
    const longitudinalTypes = allLongitudinalTypes.filter(type => type !== "Hybrid Data");
    const purposesList = extractBracketedValues(entry, "Data Collection Purpose [");
    const focusList = extractBracketedValues(entry, "Data Collection Focus [");
    
    const frequency = getField(entry, "Data Collection Frequency");
    // const duration = getField(entry, "Data Collection Duration (Years)");
    const startingYear = getField(entry, "Starting Year");
    const endingYear = getField(entry, "Ending Year");
    
    const ecec = getField(entry, "Information on ECEC or Pre-Primary Education");
    const includedGrades = extractBracketedValues(entry, "School Grades Included [");
    // const primarySecondary = getField(entry, "Data Collection on Both Primary and Secondary Education");
    const afterSchool = getField(entry, "Students Followed After School Education")
    
    const skills = extractBracketedValues(entry, "Type of Skills Analysed [");
    const measureTypes = extractBracketedValues(entry, "Measure Type [");
    const adminMethod = getField(entry, "Administration Method");
    
    const sampleTypes = extractBracketedValues(entry, "Sample Type [");
    const samplingCriteria = getField(entry, "Sampling Weights/Criteria");
    const sampleSize = getField(entry, "Average Sample Size x Wave");
    const sampleUnits = extractBracketedValues(entry, "Sample Unit [");
    
    const linkability = extractBracketedValues(entry, "Data Linkability At Individual Level [");
    const linkabilityRaw = getField(entry, "Data Linkability At Individual Level");
    
    const microdata = getField(entry, "Access to Micro Data");
    const constraints = getField(entry, "Constraints for Data Download and Management");
    const website = getField(entry, "Official Website");
    
    const advancedInfo = `
    <h3>Detailed information</h3>
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
                    ${sampleTypes.some(type => ["Non-Random Students’ Sample", "Other"].includes(type)) ? `<p><strong>Sampling Weights/Criteria:</strong> ${samplingCriteria}</p>` : ""}
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
                "Student School Attitude or Motivation", "Student Assigned Teacher Grades", "Student Allowance/Scholarship"
            ],
            "Household’s Information": [
                "Number of Parents", "Presence of Stepparents", "Siblings", "Parental Working Status", "Parental Occupation", "Parental Education",
                "Parental Education Level (ISCED)", "Parental Migratory Background", "Parents Age", "Parents Place Of Birth",
                "Parental Income or Wealth", "Parental Host Country's Language Proficiency", "Number of Books", "Number of Digital Devices",
                "Ownership of the Apartment/House"
            ],
            "Teachers’ Information": [
                "Teacher Age", "Teacher Gender", "Teacher Seniority", "Teacher Educational Degree", "Teacher Contract Type"
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
    
    
    const entryDiv = document.createElement("div");
    entryDiv.innerHTML = `
        <b>Name:</b> ${name}<br>
        <b>Acronym:</b> ${acronym}<br><br>
        ${description}<br><br>
    
        <b>Responsible Organization(s):</b> ${responsibleOrgs.join(", ") || "N/A"}<br>
        <b>Type of Longitudinal Data:</b> ${longitudinalTypes.join(", ") || "N/A"}<br>
        <b>Purpose of Data Collection:</b> ${purposesList.join(", ") || "N/A"}<br>
        <b>Data Collection Focus:</b> ${focusList.join(", ") || "N/A"}<br>
        <b>Data Collection Frequency:</b> ${frequency}<br>
        <b>Starting Year:</b> ${startingYear}<br>
        <b>Ending Year:</b> ${endingYear}<br>
        <b>Sample Level:</b> ${sampleLevel}<br>
    
        <button type-button class="btn btn-secondary btn-sm mt-2 mr-4" onclick="popoutDataset('${code}', ${index})">&#x2197; Popout</button>
        
        <div id="details-${index}" class="collapse">
            ${advancedInfo}
        </div>
        
        <button type="button" class="btn btn-success btn-sm toggle-collapse-btn mt-2 mr-4"
                data-bs-toggle="collapse"
                data-bs-target="#details-${index}"
                aria-expanded="false"
                aria-controls="details-${index}">
            Show detailed information
        </button>
    
        <div id="variables-${index}" class="collapse">
            <h3 class="mt-3">Dataset Variables</h3>
            ${variablesInfo(entry)}
        </div>
    
        <button type="button" class="btn btn-success btn-sm var-toggle-collapse-btn mt-2"
            data-bs-toggle="collapse"
            data-bs-target="#variables-${index}"
            aria-expanded="false"
            aria-controls="variables-${index}">
            Show dataset variables
        </button>
    
        <hr>
        `;
    
    // Subito dopo aver impostato innerHTML
    const collapseBtn = entryDiv.querySelector('.toggle-collapse-btn');
    const collapseId = collapseBtn.getAttribute('data-bs-target');
    const collapseEl = entryDiv.querySelector(collapseId);
    
    if (collapseEl) {
        collapseEl.addEventListener('show.bs.collapse', () => {
            collapseBtn.textContent = 'Collapse detailed information';
        });
        
        collapseEl.addEventListener('hide.bs.collapse', () => {
            collapseBtn.textContent = 'Show detailed information';
        });
    }
    const collapseVarBtn = entryDiv.querySelector('.var-toggle-collapse-btn');
    const collapseVarId = collapseVarBtn.getAttribute('data-bs-target');
    const collapseVarEl = entryDiv.querySelector(collapseVarId);
    
    if (collapseVarEl) {
        collapseVarEl.addEventListener('show.bs.collapse', () => {
            collapseVarBtn.textContent = 'Collapse dataset variables';
        });
        
        collapseVarEl.addEventListener('hide.bs.collapse', () => {
            collapseVarBtn.textContent = 'Show dataset variables';
        });
    }
    
    content.appendChild(entryDiv);
    
    closeDbModal();
    panel.classList.add("show");
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
};

// MAP BORDERS

let countryBorders = {};

// Funzione per evidenziare e zoomare su un paese
let highlightedLayer = null;

function zoomToCountry(codeOrName) {
    const iso2 = countryNameToISO2[codeOrName] || codeOrName;
    const feature = countryBorders[iso2];
    if (!feature) {
        console.warn('Confini non trovati per il codice paese:', codeOrName);
        return;
    }
    
    // Rimuovi l'evidenziazione precedente, se presente
    if (highlightedLayer) {
        map.removeLayer(highlightedLayer);
    }
    
    // Aggiungi il nuovo layer evidenziato
    highlightedLayer = L.geoJSON(feature, {
        style: {
            color: '#ff6600', //Colore del bordo
            weight: 3,
            fillOpacity: 0.2
        }
    }).addTo(map);
    
    // Ottieni i confini del paese e centra la mappa
    const bounds = highlightedLayer.getBounds();
    const center = bounds.getCenter();
    const offsetCenter = L.latLng(center.lat, center.lng - 3); // Regola questo valore per spostare la mappa a sinistra
    
    map.fitBounds(bounds, {
        paddingTopLeft: [0, 0],
        paddingBottomRight: [window.innerWidth * 0.55, 0] // La mappa occuperà il 55% a sinistra
    });
}

// FORM CONTACT US

document.addEventListener('DOMContentLoaded', function () {
    const contactTab = document.getElementById('contact-tab');
    const contactPanel = document.getElementById('contact-panel');
    const closePanel = document.getElementById('close-panel');
    
    contactTab.addEventListener('click', function () {
        contactPanel.classList.add('show');
    });
    
    closePanel.addEventListener('click', function () {
        contactPanel.classList.remove('show');
    });
    
});

document.querySelectorAll('.dropdown-toggle').forEach(button => {
    button.addEventListener('click', function () {
        const parent = this.nextElementSibling;
        parent.classList.toggle('show');
        
        
        // Chiude gli altri dropdown
        document.querySelectorAll('.custom-dropdown').forEach(drop => {
            if (drop !== parent) drop.classList.remove('show');
        });
    });
});

// Chiude i dropdown se clicchi fuori
document.addEventListener('click', function (e) {
    if (!e.target.closest('.custom-dropdown')) {
        document.querySelectorAll('.custom-dropdown').forEach(drop => drop.classList.remove('show'));
    }
});

document.getElementById("search-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        applyFilters();
    }
});

window.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        closeDbModal();
        closeDbPanel();
    }
});

// List view button
function toggleView() {
    const mapDiv = document.getElementById("map");
    const listDiv = document.getElementById("list-view");
    const button = document.getElementById("toggle-view-button");
    
    if (mapDiv.style.display !== "none") {
        // Passa alla vista lista
        mapDiv.style.display = "none";
        listDiv.style.display = "block";
        button.innerText = "Map View";
        listDiv.style.paddingLeft = "45px";
        document.body.classList.add("list-active");
        renderListView();
    } else {
        // Torna alla mappa
        listDiv.style.display = "none";
        mapDiv.style.display = "block";
        button.innerText = "List View";
        document.body.classList.add("list-active");
    }
}

function renderListView(data = mappingData) {
    
    const grouped = groupDataByCountry(data);
    const listDiv = document.getElementById("list-view");
    listDiv.innerHTML = ""; // Pulisce prima
    
    const sortedCountries = Object.keys(countries).sort(); // Ordina alfabeticamente tutte le nazioni
    
    sortedCountries.forEach(country => {
        const entries = grouped[country] || [];
        
        const section = document.createElement("section");
        section.classList.add("mb-5");
        
        // Titolo paese
        const heading = document.createElement("h3");
        heading.textContent = `${country} (${entries.length})`;
        section.appendChild(heading);
        
        // Contenitore riga
        const row = document.createElement("div");
        row.className = "row";
        
        if (entries.length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.textContent = "No datasets available for this country.";
            row.appendChild(emptyMsg);
        } else {
            entries.sort((a, b) => {
                const nameA = getField(a, "Name").toLowerCase();
                const nameB = getField(b, "Name").toLowerCase();
                return nameA.localeCompare(nameB);
            });
            
            entries.forEach((entry, index) => {
                const col = document.createElement("div");
                col.className = "col-6 mb-4";
                
                col.innerHTML = `
                    <div class="card h-100 shadow-sm d-flex flex-column">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title"><strong>Name: </strong>${getField(entry, "Name")}</h5>
                            <h6 class="card-subtitle mb-2 text-muted"><strong>Acronym: </strong>${getField(entry, "Acronym")}</h6>
                            <p class="card-text">${getField(entry, "Short Description")}</p>
                            <button class="btn btn-success mt-auto" onclick="openSingleDbModal('${country}', ${index})">Show more</button>
                        </div>
                    </div>
                `;
                
                row.appendChild(col);
            });
            
        }
        
        
        section.appendChild(row);
        listDiv.appendChild(section);
    });
}

// Crea filtri Main Filters

// function setupMainFilterDropdownToggle() {
//     const dropdown = document.getElementById("main-filters-dropdown");
//     const menu = document.getElementById("main-filters-menu");

//     const toggleButton = dropdown.querySelector(".dropdown-toggle");

//     toggleButton.addEventListener("click", () => {
    //         if (menu.style.display === "flex") {
//             menu.style.display = "none";
//         } else {
    //             menu.style.display = "flex";
//         }
//     });
// }


// document.addEventListener("DOMContentLoaded", function () {
//     if (typeof mappingData !== "undefined") {
//         createMainFilterOptions(mappingData);
//     } else {
    //         fetch("assets/mapping_data.json")
//             .then(res => res.json())
//             .then(json => {
    //                 window.mappingData = json;
//                 createMainFilterOptions(json);
//                 setupMainFilterDropdownToggle();
//             });
//     }
// });

function extractUniqueValues(data, fieldName) {
    const seen = new Set();
    const yesNo = [];
    const others = [];
    
    data.forEach(entry => {
        const val = getField(entry, fieldName);
        if (
            val &&
            val !== "N/A" &&
            val.toLowerCase() !== "not clear" &&
            val.toLowerCase() !== "no info" &&
            !seen.has(val)
        ) {
            seen.add(val);
            if (val === "Yes") {
                yesNo.unshift(val);  // mette "Yes" all'inizio
            } else if (val === "No") {
                yesNo.push(val);     // mette "No" dopo "Yes"
            } else {
                others.push(val);    // mantiene ordine di apparizione
            }
        }
    });
    
    return [...yesNo, ...others];
}

function extractByPrefix(data, prefix) {
    const seen = new Set();
    const orderedValues = [];
    
    data.forEach(entry => {
        Object.keys(entry).forEach(key => {
            if (!key.includes("[") || !key.includes("]")) return;
            
            if (key.startsWith(prefix)) {
                const match = key.match(/\[([^\]]+)\]/);
                if (match) {
                    const extracted = match[1].trim();
                    if (extracted.toLowerCase() !== "not clear" && !seen.has(extracted)) {
                        seen.add(extracted);
                        orderedValues.push(extracted);
                    }
                }
            }
        });
    });
    
    return orderedValues;
}


// function extractByPrefix(data, prefix) {
//     const values = new Set();
//     data.forEach(entry => {
    //         Object.keys(entry).forEach(key => {
        //             if (!key.includes("[") || !key.includes("]")) return; // Ignora chiavi senza parentesi

//             const value = entry[key];
//             if (key.startsWith(prefix) && value && value.toString().toLowerCase() === "yes") {
//                 const match = key.match(/\[([^\]]+)\]/);
//                 if (match) {
//                     const extracted = match[1].trim();
//                     if (extracted.toLowerCase() !== "not clear"){
//                         values.add(extracted);
//                     }
//                 }
//             }
//         });
//     });
//     return Array.from(values);
// }

function extractGrades(data) {
    const order = [
        "First", "Second", "Third", "Fourth", "Fifth", "Sixth",
        "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth"
    ];
    
    const values = new Set();
    data.forEach(entry => {
        Object.keys(entry).forEach(key => {
            if (key.startsWith("School Grades Included [")) {
                const match = key.match(/\[([^\]]+)\]/);
                if (match) values.add(match[1]);
            }
        });
    });
    return Array.from(values).sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

function extractSubOptionsIfMainIsYes(data, baseFieldName) {
    const values = new Set();
    
    data.forEach(entry => {
        const mainKey = Object.keys(entry).find(k =>
            k.trim().toLowerCase() === baseFieldName.trim().toLowerCase()
        );
        
        if (mainKey && entry[mainKey]?.toLowerCase() === "yes") {
            Object.keys(entry).forEach(key => {
                // Tolgo lo spazio superfluo qui ↓
                if (
                    key.trim().toLowerCase().startsWith(baseFieldName.trim().toLowerCase() + " [") &&
                    entry[key]?.toLowerCase() === "yes"
                ) {
                    const match = key.match(/\[([^\]]+)\]/);
                    if (match) {
                        const extracted = match[1].trim();
                        if (extracted.toLowerCase() !== "not clear") {
                            values.add(extracted);
                        }
                    }
                }
            });
        }
    });
    
    return Array.from(values).sort();
}


function setupMainFilterInteraction(data) {
    const container = document.getElementById("main-filter-labels");
    container.innerHTML = ""; // Pulisce il contenuto esistente
    
    const filters = {
        "Country": Object.keys(groupDataByCountry(data)),
        "Type of Longitudinal Data": extractByPrefix(data, "Type of Longitudinal Data ["),
        "Data Collection Focus": extractByPrefix(data, "Data Collection Focus ["),
        "Data Collection Purpose": extractByPrefix(data, "Data Collection Purpose ["),
        "Data Collection Frequency": extractUniqueValues(data, "Data Collection Frequency").sort((a, b) => {
            const order = [
                "Yearly (or more than once per year)",
                "Every other year",
                "Every three years",
                "Every four year or more"
            ];
            return order.indexOf(a) - order.indexOf(b);
        }),
        "Sample Level": extractUniqueValues(data, "Sample Level"),
        "Access to Micro Data": extractUniqueValues(data, "Access to Micro Data")
    };
    
    Object.entries(filters).forEach(([label, options]) => {
        const wrapper = document.createElement("div");
        wrapper.className = "filter-group";
        
        const toggle = document.createElement("div");
        toggle.className = "filter-toggle";
        toggle.textContent = label;
        toggle.addEventListener("click", () => {
            wrapper.classList.toggle("expanded");
        });
        
        const content = document.createElement("div");
        content.className = "filter-options";
        
        if (label === "Country") {
            const half = Math.ceil(options.length / 2);
            const col1 = document.createElement("div");
            const col2 = document.createElement("div");
            col1.className = "filter-column";
            col2.className = "filter-column";
            const row = document.createElement("div");
            row.className = "filter-row";
            
            options.forEach((opt, i) => {
                const checkbox = createCheckbox(label, opt);
                if (i < half) col1.appendChild(checkbox);
                else col2.appendChild(checkbox);
            });
            
            row.appendChild(col1);
            row.appendChild(col2);
            content.appendChild(row);
            // } else if (["Data Collection Frequency", "Sample Level", "Access to Micro Data"].includes(label)) {
            //     // Usa radio button
            //     options.forEach(opt => {
                //         const radio = createCheckbox(label, opt, true); // Passa true per radio
            //         content.appendChild(radio);
            //     });
        } else {
            // Tutti gli altri filtri usano checkbox
            options.forEach(opt => {
                const checkbox = createCheckbox(label, opt);
                content.appendChild(checkbox);
            });
        }
        
        
        wrapper.appendChild(toggle);
        wrapper.appendChild(content);
        container.appendChild(wrapper);
        
        // container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            //     cb.addEventListener("change", applyFilters);
        // });
    });
    
    
}

function setupAdvancedFilterInteraction(data) {
    const container = document.getElementById("advanced-filter-labels");
    container.innerHTML = ""; // Pulisce il contenuto esistente
    
    const filters = {
        "School Grades Included": extractGrades(data),
        "Information on ECEC or Pre-Primary Education": extractUniqueValues(data, "Information on ECEC or Pre-Primary Education"),
        "Students Followed After School Education": extractUniqueValues(data, "Students Followed After School Education"),
        "Type of Skills Analysed": extractByPrefix(data, "Type of Skills Analysed ["),
        "Measure Type": extractByPrefix(data, "Measure Type ["),
        "Sample Type": extractByPrefix(data, "Sample Type ["),
        "Sample Unit": extractByPrefix(data, "Sample Unit ["),
        "Data Linkability At Individual Level": extractSubOptionsIfMainIsYes(data, "Data Linkability At Individual Level")
    };
    
    Object.entries(filters).forEach(([label, options]) => {
        const wrapper = document.createElement("div");
        wrapper.className = "filter-group";
        
        const toggle = document.createElement("div");
        toggle.className = "filter-toggle";
        toggle.textContent = label;
        toggle.addEventListener("click", () => {
            wrapper.classList.toggle("expanded");
        });
        
        const content = document.createElement("div");
        content.className = "filter-options";
        
        if (label.toLowerCase().includes("school grades")) {
            const half = Math.ceil(options.length / 2);
            const col1 = document.createElement("div");
            const col2 = document.createElement("div");
            col1.className = "filter-column";
            col2.className = "filter-column";
            const row = document.createElement("div");
            row.className = "filter-row";
            
            options.forEach((opt, i) => {
                const checkbox = createCheckbox(label, opt);
                if (i < half) col1.appendChild(checkbox);
                else col2.appendChild(checkbox);
            });
            
            row.appendChild(col1);
            row.appendChild(col2);
            content.appendChild(row);
        } else {
            // Tutti gli altri filtri usano checkbox
            options.forEach(opt => {
                const checkbox = createCheckbox(label, opt);
                content.appendChild(checkbox);
            });
        }
        
        
        wrapper.appendChild(toggle);
        wrapper.appendChild(content);
        container.appendChild(wrapper);
        
        // container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            //     cb.addEventListener("change", applyFilters);
        // });
    });
    
    
}

function setupDataVariablesInteraction(data) {
    const container = document.getElementById("data-variables-labels");
    container.innerHTML = ""; // pulisce il contenuto esistente
    
    const groupedFields = {
        "Students' Information": [
            { label: "Student Gender", value: extractUniqueValues(data, "Student Gender") },
            { label: "Student Age", value: extractUniqueValues(data, "Student Age") },
            { label: "Student Citizenship", value: extractUniqueValues(data, "Student Citizenship") },
            { label: "Student Foreign Birth Country", value: extractUniqueValues(data, "Student Foreign Birth Country") },
            { label: "Student Specific Birth Country", value: extractUniqueValues(data, "Student Specific Birth Country") },
            { label: "Student Town of Residence", value: extractUniqueValues(data, "Student Town of Residence") },
            { label: "Student Province of Residence", value: extractUniqueValues(data, "Student Province of Residence") },
            { label: "Student Region of Residence", value: extractUniqueValues(data, "Student Region of Residence") },
            { label: "Student Belonging to a Recognized Ethnic Minority", value: extractUniqueValues(data, "Student Belonging to a Recognized Ethnic Minority") },
            { label: "Student ECEC Attendance", value: extractUniqueValues(data, "Student ECEC Attendance") },
            { label: "Student Previous Grade Retention", value: extractUniqueValues(data, "Student Previous Grade Retention") },
            { label: "Student Learning Impairments", value: extractUniqueValues(data, "Student Learning Impairments") },
            { label: "Student Physical Impairments", value: extractUniqueValues(data, "Student Physical Impairments") },
            { label: "Student School Attitude or Motivation", value: extractUniqueValues(data, "Student School Attitude or Motivation") },
            { label: "Student Assigned Teacher Grades", value: extractUniqueValues(data, "Student Assigned Teacher Grades") },
            { label: "Student Allowance/Scholarship", value: extractUniqueValues(data, "Student Allowance/Scholarship") }
        ],
        "Household's Information": [
            { label: "Number of Parents", value: extractUniqueValues(data, "Number of Parents") },
            { label: "Presence of Stepparents", value: extractUniqueValues(data, "Presence of Stepparents") },
            { label: "Siblings", value: extractUniqueValues(data, "Siblings") },
            { label: "Parental Working Status", value: extractUniqueValues(data, "Parental Working Status") },
            { label: "Parental Occupation", value: extractUniqueValues(data, "Parental Occupation") },
            { label: "Parental Education", value: extractUniqueValues(data, "Parental Education") },
            { label: "Parental Education Level (ISCED)", value: extractUniqueValues(data, "Parental Education Level (ISCED)") },
            { label: "Parental Migratory Background", value: extractUniqueValues(data, "Parental Migratory Background") },
            { label: "Parents Age", value: extractUniqueValues(data, "Parents Age") },
            { label: "Parents Place of Birth", value: extractUniqueValues(data, "Parents Place of Birth") },
            { label: "Parental Income or Wealth", value: extractUniqueValues(data, "Parental Income or Wealth") },
            { label: "Parental Host Country’s Language Proficiency", value: extractUniqueValues(data, "Parental Host Country’s Language Proficiency") },
            { label: "Number of Books", value: extractUniqueValues(data, "Number of Books") },
            { label: "Number of Digital Devices", value: extractUniqueValues(data, "Number of Digital Devices") },
            { label: "Ownership of the Apartment/House", value: extractUniqueValues(data, "Ownership of the Apartment/House") }
        ],
        "Teachers' Information": [
            { label: "Teacher Age", value: extractUniqueValues(data, "Teacher Age") },
            { label: "Teacher Gender", value: extractUniqueValues(data, "Teacher Gender") },
            { label: "Teacher Seniority", value: extractUniqueValues(data, "Teacher Seniority") },
            { label: "Teacher Educational Degree", value: extractUniqueValues(data, "Teacher Educational Degree") },
            { label: "Teacher Contract Type", value: extractUniqueValues(data, "Teacher Contract Type") },
            { label: "Student-Teacher Linkability", value: extractUniqueValues(data, "Student-Teacher Linkability") }
        ],
        "School/Class Information": [
            { label: "School Geo Referencing", value: extractUniqueValues(data, "School Geo Referencing") },
            { label: "School Type", value: extractUniqueValues(data, "School Type") },
            { label: "School Track", value: extractUniqueValues(data, "School Track") },
            { label: "School Size", value: extractUniqueValues(data, "School Size") },
            { label: "Class Size", value: extractUniqueValues(data, "Class Size") },
            { label: "School Composition", value: extractUniqueValues(data, "School Composition") },
            { label: "Class Composition", value: extractUniqueValues(data, "Class Composition") }
        ]
    };
    
    Object.entries(groupedFields).forEach(([label, fields]) => {
        const wrapper = document.createElement("div");
        wrapper.className = "filter-group";
        
        const toggle = document.createElement("div");
        toggle.className = "filter-toggle";
        toggle.textContent = label;
        toggle.addEventListener("click", () => {
            wrapper.classList.toggle("expanded");
        });
        
        const content = document.createElement("div");
        content.className = "filter-options";
        
        const uniqueVars = new Set();
        
        data.forEach(entry => {
            fields.forEach(field => {
                const fieldName = field.label;
                if (entry[fieldName] && entry[fieldName].toLowerCase() !== "n/a" && entry[fieldName] !== "-") {
                    uniqueVars.add(fieldName);
                }
            });
        });
        
        Array.from(uniqueVars).forEach(varName => {
            const labelEl = document.createElement("label");
            labelEl.className = "checkbox-label";
            
            const input = document.createElement("input");
            input.type = "checkbox";
            input.value = varName;
            input.dataset.filter = varName; // 🔑 fondamentale per far funzionare la ricerca
            
            labelEl.appendChild(input);
            labelEl.append(` ${varName}`);
            content.appendChild(labelEl);
        });
        
        wrapper.appendChild(toggle);
        wrapper.appendChild(content);
        container.appendChild(wrapper);
    });
    
}

function createCheckbox(groupLabel, optionLabel, isRadio = false) {
    const label = document.createElement("label");
    label.className = "checkbox-label";
    
    const input = document.createElement("input");
    input.type = isRadio ? "radio" : "checkbox";
    input.value = optionLabel;
    input.dataset.filter = groupLabel; 
    
    if (isRadio) {
        input.className = "form-check-input"; // ✅ serve per stile quadrato
        input.name = groupLabel; // 🔑 per gruppi esclusivi
    }
    
    label.classList.add("filter-options")
    label.appendChild(input);
    label.append(` ${optionLabel}`);
    return label;
}

function findMatchingKey(data, label) {
    const keys = Object.keys(data[0]);
    return keys.find(k => k.trim().toLowerCase() === label.trim().toLowerCase());
}


function applyCountryFilter(selectedCountries) {
    // Aggiorna i pin sulla mappa
    const filteredData = mappingData.filter(entry => {
        const match = entry["Country"]?.match(/\(([^)]+)\)/);
        const countryName = match ? match[1] : "";
        return selectedCountries.includes(countryName);
    });
    
    const countryCounts = countEntriesByCountry(filteredData);
    const grouped = groupDataByCountry(filteredData);
    
    renderMapWithCounts(countryCounts, grouped);
    
    // Salva i dati filtrati per la ricerca
    window.filteredDataForSearch = filteredData;
}


function checkIfReady() {
    if (geojsonLoaded && mappingData) {
        console.log("✔ Tutto caricato. Chiamo initMap.");
        initMap();
    }
}

function clearAllFilters() {
    // Deseleziona tutti i checkbox e radio
    const inputs = document.querySelectorAll('#filter-area input[type="checkbox"], #filter-area input[type="radio"]');
    inputs.forEach(input => input.checked = false);
    
    // Svuota input di ricerca
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";
    const grouped = groupDataByCountry(mappingData);
    const counts = countEntriesByCountry(mappingData);
    renderMapWithCounts(counts, grouped);
    renderListView(mappingData);
    updateSelectedFiltersDisplay();
    closeDbModal();
}

function showSelectedFiltersModal() {
    const modalBody = document.getElementById("selected-filters-modal-body");
    const selectedInputs = document.querySelectorAll('input[type="checkbox"]:checked');
    
    if (selectedInputs.length === 0) {
        modalBody.innerHTML = "<p class='text-muted'>No filters selected.</p>";
    } else {
        const items = Array.from(selectedInputs).map(input => {
            const group = input.dataset.filter || "Group";
            const value = input.value;
            return `<div><strong>${group}</strong>: ${value}</div>`;
        }).join("");
        modalBody.innerHTML = items;
    }
    
    const myModal = new bootstrap.Modal(document.getElementById('selectedFiltersModal'));
    myModal.show();
}

function updateSelectedFiltersDisplay() {
    const countSpan = document.getElementById("selected-filters-count");
    const list = document.getElementById("selected-filters-list");
    
    const selectedInputs = document.querySelectorAll('input[type="checkbox"]:checked');
    countSpan.textContent = selectedInputs.length;
    
    if (!list) return;
    list.innerHTML = "";
    
    if (selectedInputs.length === 0) {
        const li = document.createElement("li");
        li.className = "list-group-item text-muted";
        li.textContent = "No filters selected.";
        list.appendChild(li);
    } else {
        selectedInputs.forEach(input => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            const group = input.dataset.filter || "Group";
            li.textContent = `${group}: ${input.value}`;
            list.appendChild(li);
        });
    }
}

function popoutDataset(code, index) {
    const decodedCode = decodeURIComponent(code);
    let normalizedCode = decodedCode;
    if (decodedCode === "UK" || decodedCode.includes("England")) {
        normalizedCode = "United Kingdom";
    }

    const entry = countryEntryStore[normalizedCode]?.[index];
    if (!entry) return;

    const name = getField(entry, "Name");
    const acronym = getField(entry, "Acronym");
    const description = getField(entry, "Short Description");

    const responsibleOrgs = extractBracketedValues(entry, "Responsible Organization [");
    const allLongitudinalTypes = extractBracketedValues(entry, "Type of Longitudinal Data [");
    const longitudinalTypes = allLongitudinalTypes.filter(type => type !== "Hybrid Data");
    const purposesList = extractBracketedValues(entry, "Data Collection Purpose [");
    const focusList = extractBracketedValues(entry, "Data Collection Focus [");

    const frequency = getField(entry, "Data Collection Frequency");
    const startingYear = getField(entry, "Starting Year");
    const endingYear = getField(entry, "Ending Year");

    const ecec = getField(entry, "Information on ECEC or Pre-Primary Education");
    const includedGrades = extractBracketedValues(entry, "School Grades Included [");
    const afterSchool = getField(entry, "Students Followed After School Education");

    const skills = extractBracketedValues(entry, "Type of Skills Analysed [");
    const measureTypes = extractBracketedValues(entry, "Measure Type [");
    const adminMethod = getField(entry, "Administration Method");

    const sampleTypes = extractBracketedValues(entry, "Sample Type [");
    const samplingCriteria = getField(entry, "Sampling Weights/Criteria");
    const sampleSize = getField(entry, "Average Sample Size x Wave");
    const sampleUnits = extractBracketedValues(entry, "Sample Unit [");

    const linkability = extractBracketedValues(entry, "Data Linkability At Individual Level [");
    const linkabilityRaw = getField(entry, "Data Linkability At Individual Level");

    const microdata = getField(entry, "Access to Micro Data");
    const constraints = getField(entry, "Constraints for Data Download and Management");
    const website = getField(entry, "Official Website");

    let sampleLevel = getField(entry, "Sample Level");
    if (sampleLevel === "Limited to specific regions/areas") {
        const detail = getField(entry, "Sample Level (Details)");
        sampleLevel = `${sampleLevel}${detail !== "N/A" ? `: ${detail}` : ""}`;
    } else if (sampleLevel === "N/A" || sampleLevel === "") {
        sampleLevel = "N/A";
    }

    const variablesInfo = (entry) => {
        const sections = {
            "Students’ Information": [ "Student Gender", "Student Age", "Student Citizenship", "Student Foreign Birth Country", "Student Specific Birth Country", "Student Town of Residence", "Student Province of Residence", "Student Region of Residence", "Student Belonging to a Recognised Ethnic Minority", "Student ECEC Attendance", "Student Previous Grade Retention", "Student Learning Impairments", "Student Physical Impairments", "Student School Attitude or Motivation", "Student Assigned Teacher Grades", "Student Allowance/Scholarship" ],
            "Household’s Information": [ "Number of Parents", "Presence of Stepparents", "Siblings", "Parental Working Status", "Parental Occupation", "Parental Education", "Parental Education Level (ISCED)", "Parental Migratory Background", "Parents Age", "Parents Place Of Birth", "Parental Income or Wealth", "Parental Host Country's Language Proficiency", "Number of Books", "Number of Digital Devices", "Ownership of the Apartment/House" ],
            "Teachers’ Information": [ "Teacher Age", "Teacher Gender", "Teacher Seniority", "Teacher Educational Degree", "Teacher Contract Type" ],
            "School/Class Information": [ "School Geo-Referencing", "School Type", "School Track", "School Size", "Class Size", "School Composition", "Class Composition" ]
        };

        return Object.entries(sections).map(([title, keys]) => {
            const items = keys.map(key => {
                const val = entry[key];
                return (val && val.trim() !== "") ? `<li><strong>${key}:</strong> ${val}</li>` : "";
            }).filter(Boolean).join("");
            return items ? `<h4>${title}</h4><ul>${items}</ul>` : "";
        }).join("<br>");
    };

    const htmlContent = `
        <html>
        <head>
            <title>${name} - (${acronym}) - ${decodeURIComponent(code)}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.5; }
                h1 { font-size: 2em; margin-bottom: 0.5em; }
                h2 { margin-top: 2em; }
                h3 { margin-top: 1.5em; }
                h4 { margin-top: 1.2em; }
                ul { padding-left: 20px; }
                li { margin-bottom: 0.4em; }
            </style>
        </head>
        <body>
            <h1>${name}</h1>
            <p><strong>Acronym:</strong> ${acronym}</p>
            <p>${description}</p>
            <h2>Main Information</h2>
            <p><strong>Country:</strong> ${decodeURIComponent(code)}</p>
            <p><strong>Responsible Organization(s):</strong> ${responsibleOrgs.join(", ") || "N/A"}</p>
            <p><strong>Type of Longitudinal Data:</strong> ${longitudinalTypes.join(", ") || "N/A"}</p>
            <p><strong>Purpose of Data Collection:</strong> ${purposesList.join(", ") || "N/A"}</p>
            <p><strong>Data Collection Focus:</strong> ${focusList.join(", ") || "N/A"}</p>
            <p><strong>Data Collection Frequency:</strong> ${frequency}</p>
            <p><strong>Starting Year:</strong> ${startingYear}</p>
            <p><strong>Ending Year:</strong> ${endingYear}</p>
            <p><strong>Sample Level:</strong> ${sampleLevel}</p>

            <h2>Detailed information</h2>
            <h3>School Grades</h3>
            <p><strong>ECEC:</strong> ${ecec}</p>
            <p><strong>Included Grades:</strong> ${includedGrades.join(", ") || "None"}</p>
            <p><strong>Students followed after school education:</strong> ${afterSchool}</p>

            <h3>Students’ Skills and Achievement</h3>
            <p><strong>Skills Analysed:</strong> ${skills.join(", ") || "N/A"}</p>
            <p><strong>Measure Types:</strong> ${measureTypes.join(", ") || "N/A"}</p>
            <p><strong>Administration Method:</strong> ${adminMethod}</p>

            <h3>Sample</h3>
            <p><strong>Sample Types:</strong> ${sampleTypes.join(", ") || "N/A"}</p>
            ${sampleTypes.some(type => ["Non-Random Students’ Sample", "Other"].includes(type)) ? `<p><strong>Sampling Weights/Criteria:</strong> ${samplingCriteria}</p>` : ""}
            <p><strong>Avg Sample Size x Wave:</strong> ${sampleSize}</p>
            <p><strong>Sample Units:</strong> ${sampleUnits.join(", ") || "N/A"}</p>

            <h3>Linkability</h3>
            <p><strong>Linkability:</strong> ${linkabilityRaw}</p>
            <p><strong>Details:</strong> ${linkability.join(", ") || "N/A"}</p>

            <h3>Accessibility</h3>
            <p><strong>Access to Microdata:</strong> ${microdata}</p>
            <p><strong>Constraints:</strong> ${constraints}</p>
            <p><strong>Website:</strong> <a href="${website}" target="_blank">${website}</a></p>

            <h2>Dataset Variables</h2>
            ${variablesInfo(entry)}
        </body>
        </html>
    `;

    const popup = window.open("", "_blank", "width=1200,height=800,scrollbars=yes,resizable=yes");
    if (popup) {
        popup.document.open();
        popup.document.write(htmlContent);
        popup.document.close();
    } else {
        alert("Pop-up blocked. Please allow pop-ups for this site.");
    }
}

function handleBackButton() {
    if (!previousModalState) {
        closeDbModal(); // Nessun stato precedente → chiudi
        return;
    }

    if (previousModalState.type === "country") {
        const { code } = previousModalState;
        previousModalState = null; // Evitiamo loop infiniti
        openDbModal(code);
    } else {
        closeDbModal();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const selectedFiltersButton = document.getElementById('selected-filters-button');
    const popoverInstance = new bootstrap.Popover(selectedFiltersButton);
    
    // Funzione globale per aggiornare l'etichetta e il contenuto del popover
    window.updateSelectedFiltersDisplay = function () {
        const selected = Array.from(document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked'));
        const label = document.getElementById('selected-filters-count-label');
        
        if (selected.length === 0) {
            label.textContent = 'No filter selected';
            selectedFiltersButton.setAttribute('data-bs-content',
                "<ul class='list-group list-group-flush small mb-0 p-0'><li>No filter selected</li></ul>");
            } else {
                label.textContent = `${selected.length} filter${selected.length > 1 ? 's' : ''} selected`;
                
                const listItems = selected.map(input => {
                    const group = input.getAttribute('data-filter');
                    const value = input.value;
                    return `<li class='list-group-item py-1 px-2 small'><strong>${group}:</strong> ${value}</li>`;
                }).join('');
                
                selectedFiltersButton.setAttribute('data-bs-content',
                    `<ul class='list-group list-group-flush small mb-0 p-0'>${listItems}</ul>`);
                }
                
                // Ricrea il popover per aggiornare il contenuto dinamico
                bootstrap.Popover.getInstance(selectedFiltersButton)?.dispose();
                new bootstrap.Popover(selectedFiltersButton);
            };
            
            // 🔁 Ogni volta che cambia un checkbox o radio, aggiorna il popover
            document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
                input.addEventListener('change', () => {
                    if (window.updateSelectedFiltersDisplay) window.updateSelectedFiltersDisplay();
                });
            });
            
            // Esegui subito il rendering iniziale
            window.updateSelectedFiltersDisplay();
        });
    
        
        
        
        
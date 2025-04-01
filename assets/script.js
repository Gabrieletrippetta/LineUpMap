
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

// SCELTA DELL'UTENTE

const roleDescriptions = {
    stakeholder: "(including policymakers, institutions, NGOs, and ministries of education) interested in accessible insights and research findings derived from longitudinal data on school education. Require user-friendly visualizations, summary reports, and comparative tools to analyse trends and inequalities and support evidence-based decision-making.",
    researcher: "(including data analysts) interested in the databases themselves for deeper statistical analysis and academic studies. Need detailed dataset metadata, advanced filtering, and access information to facilitate data discovery for national and cross-national longitudinal studies."
};

function updateRoleDisplay(role) {
    const roleSpan = document.getElementById("current-role");
    const roleBox = document.getElementById("role-description-box");
    
    console.log("updateRoleDisplay() chiamato con:", role);
    
    if (role === "stakeholder") {
        roleSpan.innerText = "Educational Stakeholder";
        roleBox.innerText = roleDescriptions.stakeholder;
    } else if (role === "researcher") {
        roleSpan.innerText = "Researcher";
        roleBox.innerText = roleDescriptions.researcher;
    }
}

function showRoleDescription() {
    document.getElementById("role-description-box").style.display = "block";
}

function hideRoleDescription() {
    document.getElementById("role-description-box").style.display = "none";
}

function changeRole() {
    document.getElementById("role-modal").style.display = "flex";
}

function selectRole(role) {
    localStorage.setItem("userRole", role);
    document.getElementById("role-modal").style.display = "none";
    document.getElementById("role-display-container").style.display = "block";
    updateRoleDisplay(role);
}

// MAPPA

var map = L.map('map').setView([54.5260, 14.5551], 4.4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var countries = { "AT": [47.5162, 14.5501], "BE": [50.6203, 4.3517], "BG": [42.7339, 25.4858], "HR": [43.6, 15.2], "CY": [35.1264, 33.4299], "CZ": [49.8175, 15.4729], "DK": [56.2639, 9.5018], "EE": [58.5953, 25.0136], "FI": [61.9241, 25.7482], "FR": [46.6034, 1.8883], "DE": [51.1657, 10.4515], "GR": [39.0742, 21.8243], "HU": [47.1625, 19.5033], "IE": [53.4129, -8.2439], "IT": [41.8719, 12.5674], "LV": [56.8796, 24.6032], "LT": [55.1694, 23.8813], "LU": [49.5153, 6.1296], "MT": [35.9375, 14.3754], "NL": [52.1326, 5.2913], "PL": [51.9194, 19.1451], "PT": [39.3999, -8.2245], "RO": [45.9432, 24.9668], "SK": [48.669, 19.699], "SI": [46.1512, 14.9955], "ES": [40.4637, -3.7492], "SE": [60.1282, 16.0435], "IS": [64.9631, -19.0208], "LI": [47.166, 9.5554], "NO": [60.472, 8.4689], "CH": [46.8182, 7.2275], "GB": [53.3781, -1.436] };

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

//CREA NUMERI PER OGNI PIN DELLA MAPPA

function countEntriesByCountry(data) {
    const counts = {};
    
    data.forEach(row => {
        let rawCountry = row["Country"];
        if (rawCountry) {
            let code = rawCountry.match(/\b[A-Z]{2}\b/); // estrae sigla come IT, DE
            if (code) {
                let countryCode = code[0];
                counts[countryCode] = (counts[countryCode] || 0) + 1;
            }
        }
    });
    
    // Aggiunge i paesi mancanti con valore 0
    Object.keys(countries).forEach(code => {
        if (!counts[code]) {
            counts[code] = 0;
        }
    });
    
    return counts;
}

function groupDataByCountry(data) {
    const grouped = {};
    
    data.forEach(row => {
        let rawCountry = row["Country"];
        let match = rawCountry && rawCountry.match(/\b[A-Z]{2}\b/);
        if (match) {
            let code = match[0];
            if (!grouped[code]) grouped[code] = [];
            grouped[code].push(row);  // 👈 passiamo tutto l'oggetto originale
        }
    });
    
    return grouped;
}

const countryEntryStore = {};  // Variabile globale

function renderMapWithCounts(counts, groupedData) {
    Object.keys(countries).forEach(code => {
        const count = counts[code] || 0;
        const latlng = countries[code];
        
        const iconHtml = `
            <div class="svg-pin">
            <svg width="40" height="50" viewBox="0 0 24 24" fill="#007bff" xmlns="http://www.w3.org/2000/svg">
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
        
        const entries = groupedData[code] || [];
        countryEntryStore[code] = entries;  // 🔒 Salva dati per uso nei click handler
        
        let popupContent = `<b>${code}</b><br>`;
        
        if (entries.length === 0) {
            popupContent += `<i>No data available</i>`;
        } else {
            popupContent += `<div id="entryList-${code}" style="display: block;">`;
            entries.slice(0, 3).forEach(e => {
                const name = getField(e, "Name");
                const acronym = getField(e, "Acronymum");
                popupContent += `<div><b>${name}</b><br><i>${acronym}</i></div><hr>`;
            });
            popupContent += `</div>`;
            
            const encodedCode = encodeURIComponent(code);
            
            popupContent += `
                <button class="expand-button" onclick="zoomToCountry('${encodedCode}'); openDbModal('${encodedCode}')">
                    Show more
                </button>
                <button onclick="showCountryDetailsInPanel('${encodedCode}')">
                    Show all databases
                </button>
            `;
        }
        
        marker.bindPopup(popupContent);
        marker.on("mouseover", () => marker.openPopup());
    });
    
    console.log("COUNTS:", counts);
    console.log("GROUPED:", groupedData);
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
                    <i>${getField(e, "Acronymum")}</i><br>
                </div><hr>`;
        });
        showBtn.style.display = "none";
        hideBtn.style.display = "inline-block";
    } else {
        entries.slice(0, 3).forEach(e => {
            list.innerHTML += `
                <div>
                    <b>${getField(e, "Name")}</b><br>
                    <i>${getField(e, "Acronymum")}</i><br>
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
    if (mappingData) {
        console.log("Chiamo initMap da geojson");
        initMap();
    }
})
.catch(err => console.error("Errore nel caricamento dei confini:", err));


fetch("/data/mapping_data.json")
.then(response => {
    if (!response.ok) throw new Error("Errore nel caricamento di mapping_data.json");
    return response.json();
})
.then(data => {
    console.log("Mapping data caricato", data);
    mappingData = data;
    if (geojsonLoaded) {
        console.log("Chiamo initMap da mappingData");
        initMap();
    }
})
.catch(error => console.error("Errore nel caricamento dei dati mappa:", error));


function initMap() {
    const countryCounts = countEntriesByCountry(mappingData);
    const grouped = groupDataByCountry(mappingData);
    renderMapWithCounts(countryCounts, grouped);
}


// SHOW ALL DATABASES PANEL

function showCountryDetailsInPanel(code, entries) {
    const panelEntries = countryEntryStore[code] || [];
    const panel = document.getElementById("dbpanel");
    const title = document.getElementById("panel-country-title");
    const content = document.getElementById("dbpanel-content");
    
    title.textContent = `Databases in ${code}`;
    content.innerHTML = "";
    
    panelEntries.forEach(entry => {
        const entryDiv = document.createElement("div");
        entryDiv.innerHTML = `
            <b>Name:</b> ${getField(entry, "Name")}<br>
            <b>Acronym:</b> ${getField(entry, "Acronymum")}<br>
        `;
        content.appendChild(entryDiv);
    });
    
    panel.classList.add("show");
}


function closeDbPanel() {
    document.getElementById("dbpanel").classList.remove("show");
}

// SHOW MORE INFO ON DB

function openDbModal(countryCode) {
    const modalEntries = countryEntryStore[countryCode] || [];
    const modal = document.getElementById("db-modal");
    const title = document.getElementById("modal-country-title");
    const container = document.getElementById("modal-db-list");
    
    title.textContent = `Databases in ${countryCode}`;
    container.innerHTML = "";
    
    const role = localStorage.getItem("userRole");
    console.log("Ruolo scelto: ", role);
    
    modalEntries.forEach(entry => {
        const dbDiv = document.createElement("div");
        dbDiv.className = "db-entry";
        
        const name = getField(entry, "Name");
        const acronym = getField(entry, "Acronymum");
        const duration = getField(entry, "Data Collection Duration", "Data Collection Duration ");
        const frequency = getField(entry, "Data Collection Frequency", "Data Collection Frequency");
        const startingYear = getField(entry, "Starting Year ");
        const endingYear = getField(entry, "Ending Year ");
        
        const purposes = Object.entries(entry)
        .filter(([key, val]) => key.startsWith("Data Collection Purpose") && val && val !== "-")
        .map(([key]) => key.match(/\[(.*?)\]/)?.[1] || key)
        .join(", ") || "N/A";
        
        const sampleTypes = Object.entries(entry)
        .filter(([key, val]) => key.includes("Sample Type/Size") && val && val !== "-")
        .map(([key, val]) => val)
        .join(", ") || "N/A";
        
        let access = getField(entry, "Data Accessibility");
        if (access === "Other") {
            access = getField(entry, "Data Accessibility [Other]");
        }
        if (!access || access === "-") {
            access = "N/A";
        }
        
        if (role === "researcher") {
            const sampleLevel = getField(entry, "Sample Level");
            
            // Skill Assessed
            let skills = Object.entries(entry)
            .filter(([k, v]) => k.includes("Type of Skills Analysed") && v && v !== "-")
            .map(([k, v]) => {
                if (k.includes("Other Skills")) {
                    const other = getField(entry, "Type of Skills Analysed [Other Skills]");
                    return other !== "N/A" ? other : v;
                }
                return v;
            }).join(", ") || "N/A";
            
            // Assessment Type
            let assessment = getField(entry, "Assessment Type");
            if (assessment === "Other") {
                assessment = getField(entry, "Assessment Type [Other]");
            }
            
            // Data Linkability
            const linkability = Object.entries(entry)
            .filter(([k, v]) => k.includes("Data Linkability at Individual Level") && v && v !== "-")
            .map(([_, v]) => v)
            .join(", ") || "N/A";
            
            // Microdata Accessibility
            let microdataDisplay = "";
            const microdataLinks = Object.entries(entry)
            .filter(([key, val]) =>
                key.startsWith("Access to Micro-Data") &&
            typeof val === "string"
            )
            .map(([_, val]) => {
                const match = val.match(/https?:\/\/[^\s"]+/);
                return match ? `<a href="${match[0]}" target="_blank">${match[0]}</a>` : val;
            });
        
        if (microdataLinks.length > 0) {
            microdataDisplay = `<b>Access to Micro-Data:</b> ${microdataLinks.join(", ")}<br>`;
        }
        
        // Website or links
        let linkInfo = getField(entry, "Data Accessibility");
        if (linkInfo === "Other") {
            linkInfo = getField(entry, "Data Accessibility [Other]");
        }
        // Access logic: link or microdata fallback
        let accessLabel = "Access to Micro-Data";
        let accessDisplay = "N/A";
        
        let rawAccess = getField(entry, "Data Accessibility");
        if (rawAccess === "Other") {
            rawAccess = getField(entry, "Data Accessibility [Other]");
        }
        
        if (rawAccess && rawAccess.includes("http")) {
            const match = rawAccess.match(/https?:\/\/[^\s"]+/);
            if (match) {
                accessLabel = "Website and/or Direct Links to Data or Data Owners";
                accessDisplay = `<a href="${match[0]}" target="_blank">${match[0]}</a>`;
            } else {
                accessLabel = "Website and/or Direct Links to Data or Data Owners";
                accessDisplay = rawAccess;
            }
        } else {
            // fallback a microdata accessibility
            const microdata = Object.entries(entry)
            .filter(([k, v]) => k.startsWith("Access to Micro-Data") && v && v !== "-")
            .map(([_, v]) => v)
            .join(", ") || "N/A";
            accessDisplay = microdata;
        }
        
        
        // Variables Collected (placeholder)
        const variables = "";
        dbDiv.innerHTML = `
                <b>Name:</b> ${name}<br>
                <b>Acronym:</b> ${acronym}<br>
                <b>Purpose of Data Collection:</b> ${purposes}<br>
                <b>Target Population:</b> ${sampleTypes}<br>
                <b>Time of Data Collection:</b> ${duration}<br>
                <b>Frequency:</b> ${frequency}<br>
                <b>Starting Year:</b> ${startingYear}<br>
                <b>Ending Year: </b> ${endingYear}<br>
                <b>Access Information:</b> ${access}<br>
                <b>Sample & Representativeness:</b> ${sampleLevel}<br>
                <b>Skill Assessed:</b> ${skills}<br>
                <b>Assessment Type:</b> ${assessment}<br>
                <b>Data Linkability:</b> ${linkability}<br>
                <b>Variables Collected:</b> ${variables}<br>
                ${accessDisplay.includes("http") ? microdataDisplay : ""}
                <b>${accessLabel}</b> ${accessDisplay}<br>
            `;
    } else {
        dbDiv.innerHTML = `
                <b>Name:</b> ${name}<br>
                <b>Acronym:</b> ${acronym}<br>
                <b>Type of Longitudinal Data:</b> ${getField(entry, "Individual Level Longitudinal Design", "Longitudinal")}<br>
                <b>Purpose of Data Collection:</b> ${purposes}<br>
                <b>Target Population:</b> ${sampleTypes}<br>
                <b>Time of Data Collection:</b> ${duration}<br>
                <b>Frequency:</b> ${frequency}<br>
                <b>Starting Year:</b> ${startingYear}<br>
                <b>Ending Year: </b> ${endingYear}<br>
                <b>Access Information:</b> ${access}
            `;
    }
    
    container.appendChild(dbDiv);
});

modal.classList.add("show");
}

function closeDbModal() {
    document.getElementById("db-modal").classList.remove("show");
    
    // Rimuove evidenziazione confine
    if (highlightedLayer) {
        map.removeLayer(highlightedLayer);
        highlightedLayer = null;
    }
    
    // Torna alla vista iniziale della mappa (Europa)
    map.setView([54.5260, 14.5551], 4.4);
}

// MAP BORDERS

let countryBorders = {};

// Funzione per evidenziare e zoomare su un paese
let highlightedLayer = null;

function zoomToCountry(code) {
    const feature = countryBorders[code];
    if (!feature) {
        console.warn('Confini non trovati per il codice paese:', code);
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

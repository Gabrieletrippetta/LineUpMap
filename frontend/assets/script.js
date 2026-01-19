function getFillColorByCount(n) {
    if (!n || n === 0) return '#7a7a7a';   
    if (n >= 20) return '#AFCA00';         
    if (n >= 9)  return '#637E00';         
    if (n >= 7)  return '#93bbd8';        
    if (n >= 5)  return '#64c9c4';         
    if (n >= 3)  return '#6490c9';         
    return '#1a82cc';                      
}

// Restituisce il "count" da usare per il fill, con la regola speciale del Belgio = somma Flanders + Wallonia
// Count da usare per il fill (Belgio = somma Flanders + Wallonia)
function getCountryFillCount(iso2FromGeo, counts) {
    const isoData = toDataISO(iso2FromGeo); // GR->EL, GB->UK

    if (isoData === 'BE') {
        const fl = counts['Belgium (Flanders)'] || 0;
        const wa = counts['Belgium (Wallonia)'] || 0;
        return fl + wa;
    }   

    // countryNameToISO2 mappa "United Kingdom"->"UK", "Greece"->"EL", ecc.
    const name = Object.entries(countryNameToISO2)
        .find(([n, c]) => c === isoData)?.[0];
    return name ? (counts[name] || 0) : 0;
}


// const colorPalette = [
//     '#AFCA00',
//     '#1a82cc',
//     '#999', 
//     '#637E00',
//     '#93bbd8',
//     '#a1b45a',
//     '#64c9c4',
//     '#7a7a7a',
//     '#c5c5c5', 
//     '#b7cf73',
//     '#6490c9'
// ];

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

/**
 * Converte URL in testo in link HTML cliccabili
 * @param {string} text - Testo che può contenere URL
 * @returns {string} - HTML con link cliccabili
 */
function makeLinksClickable(text) {
    if (!text || text === "N/A" || text === "-" || text === "null") {
        return text;
    }
    
    // Pattern per riconoscere URL (http, https, www)
    const urlPattern = /(https?:\/\/[^\s,;]+|www\.[^\s,;]+)/gi;
    
    // Sostituisci ogni URL con un tag <a>
    return text.replace(urlPattern, (url) => {
        // Aggiungi https:// se l'URL inizia con www
        const href = url.startsWith('www.') ? `https://${url}` : url;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
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
let countryLayers = {}; // iso2 -> layer geoJSON
var currentZoom = 3;
const {center, zoom, isBig} = getInitialMapView();
const defaultBounds = [[15, -40], [80, 80]];
const bigScreenBounds = [[34, -15], [72, 40]];
var map = L.map('map', {
    center: center,
    zoom: zoom,
    minZoom: 4.2,
    worldCopyJump: false,
    zoomControl: true,
    maxBounds: isBig ? bigScreenBounds : defaultBounds,
    maxBoundsViscosity: 1.0
});

// var map = L.map('map').setView([54.5260, 14.5551], 4.4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
let __bordersReady = false;        // confini pronti
let __initialCounts = null;        // primi conteggi disponibili


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
    "Iceland": [64.9631, -19.0208],
    "Ireland": [53.4129, -8.2439],
    "Italy": [41.8719, 12.5674],
    "Latvia": [56.8796, 24.6032],
    "Liechtenstein": [47.166, 9.5554],
    "Lithuania": [55.1694, 23.8813],
    "Luxembourg": [49.5153, 6.1296],
    "Malta": [35.9375, 14.3754],
    "Netherlands": [52.1326, 5.2913],
    "Norway": [60.472, 8.4689],
    "Poland": [51.9194, 19.1451],
    "Portugal": [39.3999, -8.2245],
    "Romania": [45.9432, 24.9668],
    "Slovakia": [48.669, 19.699],
    "Slovenia": [46.1512, 14.9955],
    "Spain": [40.4637, -3.7492],
    "Sweden": [60.1282, 16.0435],
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



const countryColors = {};
let colorIndex = 0;
let countryCountsGlobal = {};

function assignUniqueColor(isoCode) {
    if (!countryColors[isoCode]) {
        countryColors[isoCode] = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;
    }
    return countryColors[isoCode];
}

// function normalizeISO(iso2) {
//     const isoFix = { "UK": "GB", "GB": "UK", "EL": "GR", "GR": "EL", "BE-FL": "BE", "BE-WA": "BE" };
//     return isoFix[iso2] || iso2;
// }
// Da codice "dei dati" -> codice per il GeoJSON (confini)
function toGeoJSONISO(iso) {
    const map = { "UK": "GB", "EL": "GR", "BE-FL": "BE", "BE-WA": "BE" };
    return map[iso] || iso;
}

// Da codice del GeoJSON -> codice "dei dati" (countryNameToISO2 / counts)
function toDataISO(iso) {
    const map = { "GB": "UK", "GR": "EL" };
    return map[iso] || iso;
}

function drawAllCountriesColored(counts = null) {
    // Se non abbiamo i counts (es. geojson caricato prima dei dati), inizializziamo a 0
    const safeCounts = counts || {};
    Object.entries(countryBorders).forEach(([iso2, feature]) => {
        const baseCount = getCountryFillCount(iso2, safeCounts);
        const baseStyle = {
        color: '#444',
        weight: 1,
        fillColor: getFillColorByCount(baseCount),
        fillOpacity: 1
        };

        const layer = L.geoJSON(feature, {
        style: baseStyle,
        onEachFeature: (feat, lyr) => {
            const el = () => (lyr.getElement ? lyr.getElement() : lyr._path);

            lyr.on('mouseover', (e) => {
            e.target.setStyle({ weight: 3, fillOpacity: 0.5 });
            if (e.target.bringToFront) e.target.bringToFront();
            const elem = el();
            if (elem) elem.classList.add('country-pop', 'country-pointer');
            });

            lyr.on('mouseout', (e) => {
            // ripristina lo stile in base ai counts correnti
            const iso2x = toDataISO(feat.properties.ISO2);
            const cur = getCountryFillCount(iso2x, window.__latestCountsForFill || {});
            e.target.setStyle({ color:'#444', weight:1, fillColor:getFillColorByCount(cur), fillOpacity:1 });
            const elem = el();
            if (elem) elem.classList.remove('country-pop', 'country-pointer');
            });

            lyr.on('touchstart', (e) => {
            e.target.setStyle({ weight: 3, fillOpacity: 0.75 });
            const elem = el();
            if (elem) elem.classList.add('country-pop', 'country-pointer');
            setTimeout(() => {
                const iso2x = toDataISO(feat.properties.ISO2);
                const cur = getCountryFillCount(iso2x, window.__latestCountsForFill || {});
                e.target.setStyle({ color:'#444', weight:1, fillColor:getFillColorByCount(cur), fillOpacity:1 });
                if (elem) elem.classList.remove('country-pop', 'country-pointer');
            }, 300);
            });

            lyr.on('click', (e) => {
            let iso2x = toDataISO(feat.properties.ISO2);
            const name = getCountryNameFromISO2(iso2x);
            if (!name) return console.warn("Nessun nome trovato per ISO:", iso2x);
            const popupHtml = buildCountryPopupHTML(name);
            L.popup({ autoPan: true, maxWidth: 320 })
                .setLatLng(e.latlng)
                .setContent(popupHtml)
                .openOn(map);
            });
        }
        });

        
        // salva il layer per recolor successivi
        countryLayers[iso2] = layer;
        layer.addTo(map);
    });

    __bordersReady = true;
    if (window.__latestCountsForFill) {
    colorCountriesByCounts(window.__latestCountsForFill);
    }
}

function colorCountriesByCounts(counts) {
    // memorizziamo l’ultima mappa counts per gestire mouseout/touchend
    window.__latestCountsForFill = counts || {};
    Object.entries(countryLayers).forEach(([iso2, layer]) => {
        const n = getCountryFillCount(iso2, window.__latestCountsForFill);
        const fill = getFillColorByCount(n);
        layer.setStyle({ fillColor: fill, fillOpacity: 1, color:'#444', weight:1 });
    });
}

/**
 * Funzione wrapper per aggiornare i colori della mappa dai dati del backend
 * Chiamata da api.js dopo il caricamento delle statistiche
 */
function updateMapColors(datasetsByCountry) {
    console.log('🎨 Aggiornamento colori mappa con dati:', datasetsByCountry);
    
    if (!datasetsByCountry || Object.keys(datasetsByCountry).length === 0) {
        console.warn('⚠️ Nessun dato per aggiornare i colori della mappa');
        return;
    }
    
    // Attendi che i bordi siano pronti
    if (__bordersReady) {
        colorCountriesByCounts(datasetsByCountry);
        console.log('✅ Colori mappa aggiornati');
    } else {
        // Se i bordi non sono ancora pronti, salva i dati per dopo
        console.log('⏳ Bordi non ancora pronti, salvataggio dati per dopo...');
        window.__latestCountsForFill = datasetsByCountry;
    }
}


function getCountryNameFromISO2(iso2FromGeo) {
    const isoData = toDataISO(iso2FromGeo); // GR->EL, GB->UK
    for (const [name, code] of Object.entries(countryNameToISO2)) {
        if (code === isoData) return name;
    }
    return null;
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
            let iso2 = match[1];
            iso2 = toDataISO(iso2);
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
                if (iso2 === "UK" || iso2 === "GB") iso2 = "UK";
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
        
        const pinColor = count > 0 ? "#006EC4" : "#38383E ";
        
        const iconHtml = `
            <div class="svg-pin">
            <svg width="50" height="60" viewBox="0 0 24 24" fill="${pinColor}" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#FFFFFF" stroke-width="1" />
            </svg>
            <span class="pin-count">${count}</span>
            </div>`;
        
        const icon = L.divIcon({
            className: '',
            html: iconHtml,
            iconSize: [50, 60],
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
    
    // aggiorna il fill dei paesi in base ai counts correnti (inclusi i filtri)
    if (typeof colorCountriesByCounts === 'function') {
        colorCountriesByCounts(counts);
    }
    // console.log("COUNTS:", counts);
    // console.log("GROUPED:", groupedData);
}

function buildCountryPopupHTML(countryName) {
    const entries = (countryEntryStore[countryName] || []).slice().sort((a, b) => {
        const aName = getField(a, "Name").toLowerCase();
        const bName = getField(b, "Name").toLowerCase();
        return aName.localeCompare(bName);
    });
    const count = entries.length;

    let html = `<p class="popup-country">Datasets in <b>${countryName}</b></p>`;
    if (count === 0) {
        html += `<i>No data available</i>`;
        return html;
    }

    html += `<div id="entryList-${countryName}" style="display:block;">`;
    entries.slice(0, 3).forEach((e, i) => {
        const name = getField(e, "Name");
        const acronym = getField(e, "Acronym");
        const encoded = encodeURIComponent(countryName);
        html += `
        <div class="entry-preview">
            <strong>Name: </strong><span>${name}</span><br>
            <strong>Acronym: </strong><i>${acronym}</i><br>
            <div style="text-align:right;">
            <button class="expand-button" onclick="openSingleDbModal('${encoded}', ${i})">Show more</button>
            </div>
        </div><hr>`;
    });
    html += `</div>`;

    if (count > 3) {
        const encoded = encodeURIComponent(countryName);
        html += `
        <div class="popup-buttons">
            <button class="show-button" onclick="zoomToCountry('${encoded}'); openDbModal('${encoded}')">
            Show all datasets (${count})
            </button>
        </div>`;
    }
    return html;
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
    drawAllCountriesColored({});
})
.catch(err => console.error("Errore nel caricamento dei confini:", err));

document.addEventListener("DOMContentLoaded", () => {
    // ❌ RIMOSSO: ora i dati vengono caricati da api.js dal database
    // fetch("./data/mapping_data.json")
    // .then(response => {
    //     if (!response.ok) throw new Error("Errore nel caricamento di mapping_data.json");
    //     return response.json();
    // })
    // .then(data => {
    //     console.log("Mapping data caricato", data);
    //     mappingData = data;
    //     populateCountryFilter();
    //     window.filteredDataForSearch = data;
    //     checkIfReady();
    //     setupMainFilterInteraction(mappingData);
    //     setupAdvancedFilterInteraction(mappingData);
    //     setupDataVariablesInteraction(mappingData);
    //     // setupVariablesFilterInteraction(mappingData);
    //     //   setupMainFilterDropdownToggle();
    //     // ✅ Imposta il placeholder dinamico nel campo di ricerca
    //     const searchInput = document.getElementById("search-input");
    //     if (searchInput && searchInput.value.trim() === "") {
    //         searchInput.placeholder = `Search among ${mappingData.length} datasets`;
    //     }
    //     if (geojsonLoaded) {
    //         console.log("Chiamo initMap da mappingData");
    //         initMap();
    //     }
    // })
    // .catch(error => console.error("Errore nel caricamento dei dati mappa:", error));
    
    console.log("✅ DOMContentLoaded - I dati verranno caricati da api.js");
    window.mappingDataReady = true;
});

// Zoom iniziale basato sulla larghezza *effettiva* del contenitore mappa
function getInitialMapView() {
    const mapEl = document.getElementById('map');
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const containerW = mapEl?.clientWidth || vw;

    // la tua #map è ~ 2/3 dello schermo: 2000px * 0.666 ≈ 1333
    const cutoff = 2000 * 0.666;

    const isBig = containerW >= cutoff;
    const center = isBig ? [54, 10] : [54, 15];
    const zoom   = isBig ? 3.5   : 4.4;

    return { center, zoom, isBig };
}


function initMap() {
    const countryCounts = countEntriesByCountry(mappingData);
    const grouped = groupDataByCountry(mappingData);
    renderMapWithCounts(countryCounts, grouped);
    colorCountriesByCounts(countryCounts);
    setupMainFilterInteraction(mappingData);
    setupAdvancedFilterInteraction(mappingData);
    setupDataVariablesInteraction(mappingData);
    // setupVariablesFilterInteraction(mappingData);
    Object.entries(countryNameToISO2).forEach(([country, iso2]) => {
        const color = countryColors[iso2];
        console.log(`${country} (${iso2}): ${color}`);
    });
    window.__latestCountsForFill = countryCounts; // usato anche da mouseout
    __initialCounts = countryCounts;

    if (__bordersReady) {
    colorCountriesByCounts(countryCounts);
    }
}

// stile leggero per la legenda
(function addLegendStyles(){
    if (document.getElementById('choropleth-legend-style')) return;
    const style = document.createElement('style');
    style.id = 'choropleth-legend-style';
    style.textContent = `
        .choropleth-legend {
        background: #fff;
        padding: 10px 12px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,.15);
        font: 12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
        color: #222;
        }
        .choropleth-legend .legend-title { font-weight: 600; margin-bottom: 6px; }
        .choropleth-legend ul { list-style: none; margin: 0; padding: 0; }
        .choropleth-legend li { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
        .choropleth-legend .swatch {
        width: 16px; height: 12px; border: 1px solid #0003; flex: 0 0 16px;
        }
        .choropleth-legend .legend-note { margin-top: 8px; opacity: .7; font-size: 11px; }
    `;
    document.head.appendChild(style);
})();

// legenda choropleth (bottom-right)
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'choropleth-legend');
    // NB: colori identici a getFillColorByCount
    div.innerHTML = `
        <div class="legend-title">Dataset per country</div>
        <ul>
        <li><span class="swatch" style="background:#7a7a7a"></span> 0</li>
        <li><span class="swatch" style="background:#1a82cc"></span> 1–2</li>
        <li><span class="swatch" style="background:#6490c9"></span> 3–4</li>
        <li><span class="swatch" style="background:#64c9c4"></span> 5–6</li>
        <li><span class="swatch" style="background:#93bbd8"></span> 7–8</li>
        <li><span class="swatch" style="background:#637E00"></span> 9–19</li>
        <li><span class="swatch" style="background:#AFCA00"></span> 20+</li>
        </ul>
        <div class="legend-note">Belgium = Flanders + Wallonia</div>
    `;
    // evita che il mouse sulla legenda trascini/zoomi la mappa
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    return div;
};
legend.addTo(map);

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

/**
 * Ordina i gradi scolastici in ordine numerico
 */
function sortSchoolGrades(grades) {
    const order = [
        "First Grade", "Second Grade", "Third Grade", "Fourth Grade", 
        "Fifth Grade", "Sixth Grade", "Seventh Grade", "Eighth Grade", 
        "Ninth Grade", "Tenth Grade", "Eleventh Grade", "Twelfth Grade", 
        "Thirteenth Grade"
    ];
    
    return grades.sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const orderLower = order.map(o => o.toLowerCase());
        
        const indexA = orderLower.indexOf(aLower);
        const indexB = orderLower.indexOf(bLower);
        
        // Se uno dei due non è nell'array, mettilo alla fine
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        
        return indexA - indexB;
    });
}

// SHOW REALLY BASIC INFO ON DB

function openDbModal(code) {
    previousModalState = null;
    updateBackButtonVisibility();
    const decodedCode = decodeURIComponent(code);
    let normalizedCode = decodedCode;
    
    // Normalizza eventuali sinonimi noti
    if (decodedCode === "UK" || decodedCode === "GB" || decodedCode.includes("England")) {
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
    if (decodedCode === "UK" || decodedCode === "GB" || decodedCode.includes("England")) {
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
        const longitudinalStructure = getField(entry, "Longitudinal Data Structure");
        const longitudinalTypes = getField(entry, "Type of Longitudinal Data");
        const purposesList = extractBracketedValues(entry, "Data Collection Purpose [");
        const focusList = extractBracketedValues(entry, "Data Collection Focus [");
        
        const frequency = getField(entry, "Data Collection Frequency");
        const startingYear = getField(entry, "Starting Year");
        const endingYear = getField(entry, "Ending Year");
        
        const ecec = getField(entry, "Information on ECEC or Pre-Primary Education");
        const includedGrades = sortSchoolGrades(extractBracketedValues(entry, "School Grades Included ["));
        // const primarySecondary = getField(entry, "Data Collection on Both Primary and Secondary Education");
        const afterSchool = getField(entry, "Students Followed After School Education")
        
        let skills = extractBracketedValues(entry, "Type of Skills Analysed [");
        const otherDetails = getField(entry, "Other Skills (Details)");

        skills = skills.map(skill => {
            if (skill.toLowerCase() === "other skills" && otherDetails && otherDetails !== "N/A") {
                const clickableDetails = makeLinksClickable(otherDetails.replace(/;/g, ", "));
                return `Other Skills: ${clickableDetails}`;
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
            <b>Longitudinal Data Structure:</b> ${longitudinalStructure || "N/A"} Data<br>
            <b>Type of Longitudinal Data:</b> ${longitudinalTypes || "N/A"} Data<br>
            <b>Purpose of Data Collection:</b> ${purposesList.join(", ") || "N/A"}<br>
            <b>Data Collection Focus:</b> ${focusList.join(", ") || "N/A"}<br>
            <b>Data Collection Frequency:</b> ${frequency}<br>
            <b>Starting Year:</b> ${startingYear}<br>
            <b>Ending Year:</b> ${endingYear}<br>
            <b>Sample Level:</b> ${sampleLevel}<br>
        
            <button type-button class="btn btn-secondary btn-sm mt-2 popout" onclick="popoutDataset('${normalizedCode}', ${index})">&#x2197; Popout</button>
        
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
    const { center: initCenter, zoom: initZoom } = getInitialMapView();
    map.setView(initCenter, initZoom);
}

function openSingleDbModal(code, index) {
    previousModalState = { type: "country", code };
    updateBackButtonVisibility();
    const decodedCode = decodeURIComponent(code);
    let normalizedCode = decodedCode;
    
    // Normalizza eventuali sinonimi noti
    if (decodedCode === "UK" || decodedCode === "GB" || decodedCode.includes("England")) {
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

    const longitudinalStructure = getField(entry, "Longitudinal Data Structure");
    const longitudinalTypes = getField(entry, "Type of Longitudinal Data");
    const purposesList = extractBracketedValues(entry, "Data Collection Purpose [");
    const focusList = extractBracketedValues(entry, "Data Collection Focus [");
    
    const frequency = getField(entry, "Data Collection Frequency");
    // const duration = getField(entry, "Data Collection Duration (Years)");
    const startingYear = getField(entry, "Starting Year");
    const endingYear = getField(entry, "Ending Year");
    
    const ecec = getField(entry, "Information on ECEC or Pre-Primary Education");
    const includedGrades = sortSchoolGrades(extractBracketedValues(entry, "School Grades Included ["));
    // const primarySecondary = getField(entry, "Data Collection on Both Primary and Secondary Education");
    const afterSchool = getField(entry, "Students Followed After School Education")
    
    let skills = extractBracketedValues(entry, "Type of Skills Analysed [");
    const otherDetails = getField(entry, "Other Skills (Details)");

    skills = skills.map(skill => {
        if (skill.toLowerCase() === "other skills" && otherDetails && otherDetails !== "N/A") {
            const clickableDetails = makeLinksClickable(otherDetails.replace(/;/g, ", "));
            return `Other Skills: ${clickableDetails}`;
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
        <b>Longitudinal Data Structure:</b> ${longitudinalStructure || "N/A"} Data<br>
        <b>Type of Longitudinal Data:</b> ${longitudinalTypes || "N/A"} Data<br>
        <b>Purpose of Data Collection:</b> ${purposesList.join(", ") || "N/A"}<br>
        <b>Data Collection Focus:</b> ${focusList.join(", ") || "N/A"}<br>
        <b>Data Collection Frequency:</b> ${frequency}<br>
        <b>Starting Year:</b> ${startingYear}<br>
        <b>Ending Year:</b> ${endingYear}<br>
        <b>Sample Level:</b> ${sampleLevel}<br>
    
        <button type-button class="btn btn-secondary btn-sm mt-2 mr-4 popout" onclick="popoutDataset('${normalizedCode}', ${index})">&#x2197; Popout</button>
        
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
    if (!codeOrName) return;

    // 1) Decodifica eventuale URL encoding (es. "United%20Kingdom")
    const decoded = decodeURIComponent(String(codeOrName));

    // 2) Normalizza alias noti -> chiave del tuo dizionario (countries/countryNameToISO2)
    let name = decoded;
    if (
        decoded === "UK" ||
        decoded === "GB" ||
        /England|Scotland|Wales|Northern Ireland/i.test(decoded)
    ) {
        name = "United Kingdom";
    }

    // 3) Dal nome ricava ISO2 (o usa direttamente se già ISO)
    let iso2 = countryNameToISO2[name] || name;

    // 4) Aggiusta gli ISO che non coincidono con il GeoJSON
    //    - UK -> GB (nel GeoJSON è "GB")
    //    - EL -> GR (Greece nei dati EU è "EL", nel GeoJSON di solito "GR")
    //    - BE-FL / BE-WA -> BE (se non hai i confini regionali)
    const isoFix = { "UK": "GB", "EL": "GR", "BE-FL": "BE", "BE-WA": "BE" };
    iso2 = isoFix[iso2] || iso2;

    const feature = countryBorders[iso2];

    if (!feature) {
        console.warn("Confini non trovati per:", {
            input: codeOrName, decoded, name, iso2,
            available: Object.keys(countryBorders)
        });

        // fallback: centra sulla coordinata del marker se esiste
        if (countries[name]) {
            map.setView(countries[name], 6);
        }
        return;
    }

    // Rimuovi evidenziazione precedente
    if (highlightedLayer) map.removeLayer(highlightedLayer);

    // Evidenzia e fai fit
    highlightedLayer = L.geoJSON(feature, {
        style: { color: "#444", weight: 5, fillOpacity: 0.2 }
    }).addTo(map);

    const bounds = highlightedLayer.getBounds();
    map.fitBounds(bounds, {
        paddingTopLeft: [0, 0],
        paddingBottomRight: [window.innerWidth * 0.33, 0]
    });
}

// FORM CONTACT US

document.addEventListener('DOMContentLoaded', function () {
    const contactTab = document.getElementById('contact-tab');
    const contactPanel = document.getElementById('contact-panel');
    const closePanel = document.getElementById('close-panel');
    const headerTitle = document.getElementById('header-title');
    const h1 = headerTitle ? headerTitle.querySelector('h1') : null;

    function shrinkTitleToFit(minPx = 6) {
        if (!headerTitle || !h1) return;

        // Reset: riparti dal 40px !important (via var CSS) e una sola riga per misurare
        headerTitle.style.removeProperty('--h1-size');
        h1.classList.remove('wrap', 'clamp-2');
        h1.style.whiteSpace = 'nowrap';
        h1.style.overflow = 'visible';   // <-- niente overflow hidden

        const available = headerTitle.clientWidth;
        if (!available) return;

        // Se già entra su una riga, finito
        if (h1.scrollWidth <= available) return;

        // Riduci anche sotto i 10px: minimo 6px (puoi scendere a 5 o 4 se vuoi)
        let size  = parseFloat(getComputedStyle(h1).fontSize) || 24;
        let guard = 160;

        while (h1.scrollWidth > available && size > minPx && guard-- > 0) {
            size -= 0.5;
            headerTitle.style.setProperty('--h1-size', size + 'px'); // batte il 40px !important
        }

        // Se a font minimo ancora non entra, abilita il WRAP
        if (h1.scrollWidth > available) {
            h1.classList.add('wrap');       // ora può andare su 2+ righe
            // (se vuoi massimo 2 righe, posso aggiungere una clamp)
        }
    }

    function openContactPanel() {
        if (!contactPanel) return;
        contactPanel.classList.add('show');
        document.body.classList.add('contact-open');
        
        requestAnimationFrame(() => shrinkTitleToFit(6));
    }

    function closeContactPanel() {
        if (!contactPanel) return;
        contactPanel.classList.remove('show');
        document.body.classList.remove('contact-open');

        headerTitle.style.removeProperty('--h1-size');
        if (h1) h1.style.whiteSpace = '';
    }
    
    if (contactTab) contactTab.addEventListener('click', openContactPanel);
    if (closePanel) closePanel.addEventListener('click', closeContactPanel);

    window.addEventListener('resize', () => {
        if (document.body.classList.contains('contact-open')) {
            requestAnimationFrame(() => shrinkTitleToFit(6));
        }
    });

    // contactTab.addEventListener('click', function () {
    //     contactPanel.classList.add('show');
    //     headerTitle.style.marginLeft = '425px';
    // });
    
    // closePanel.addEventListener('click', function () {
    //     contactPanel.classList.remove('show');
    //     headerTitle.style.marginLeft = '0';
    // });
    
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
            emptyMsg.textContent = "No datasets available for this country or with the selected filters.";
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
        "First grade", "Second grade", "Third grade", "Fourth grade", "Fifth grade", "Sixth grade",
        "Seventh grade", "Eighth grade", "Ninth grade", "Tenth grade", "Eleventh grade", "Twelfth grade", "Thirteenth grade"
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
    
    const accordion = document.createElement("div");
    accordion.className = "accordion";
    accordion.id = "mainFiltersAccordion";

    const filters = {
        "Country": Object.keys(groupDataByCountry(data)),
        "Longitudinal Data Structure": extractUniqueValues(data, "Longitudinal Data Structure").sort((a, b) => {
            const order = [
                "Pure Longitudinal",
                "Pseudo-Panel",
                "Repeated Cross-Sectional",
            ];
            return order.indexOf(a) - order.indexOf(b);
        })
        .map(label => `${label} Data`),
        "Type of Longitudinal Data": extractUniqueValues(data, "Type of Longitudinal Data").sort((a, b) => {
            const order = [
                "Administrative",
                "Survey",
                "Hybrid"
            ];
            return order.indexOf(a) - order.indexOf(b);
        })
        .map(label => `${label} Data`),
        "Data Collection Focus": extractByPrefix(data, "Data Collection Focus [").sort((a, b) => {
            const order = [
                "School Education",
                "School-to-Work Transition",
                "Household and Family Choices",
                "Child Development"
            ];
            return order.indexOf(a) - order.indexOf(b);
        }),
        "Data Collection Purpose": extractByPrefix(data, "Data Collection Purpose [").sort((a, b) => {
            const order = [
                "Academic Research",
                "School System Monitoring/Evaluation",
                "Educational Institution Monitoring/Evaluation",
                "Low-stake Individual Assessment",
                "High-stake Individual Assessment"
            ];
            return order.indexOf(a) - order.indexOf(b);
        }),
        "Data Collection Frequency": extractUniqueValues(data, "Data Collection Frequency").sort((a, b) => {
            const order = [
                "Yearly (or more than once per year)",
                "Every other year",
                "Every three years",
                "Every four years or more"
            ];
            return order.indexOf(a) - order.indexOf(b);
        }),
        "Sample Level": extractUniqueValues(data, "Sample Level"),
        "Access to Micro Data": extractUniqueValues(data, "Access to Micro Data")
    };
    
    let idx=0;
    Object.entries(filters).forEach(([label, options]) => {
    const itemId = `mainFilter-${idx++}`;
    const item = document.createElement("div");
    item.className = "accordion-item";

    // Header/button
    const h = document.createElement("h2");
    h.className = "accordion-header";
    const btn = document.createElement("button");
    btn.className = "accordion-button collapsed";
    btn.type = "button";
    btn.setAttribute("data-bs-toggle", "collapse");
    btn.setAttribute("data-bs-target", `#${itemId}`);
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", itemId);
    btn.textContent = label;
    h.appendChild(btn);

    // Corpo/collapse
    const collapse = document.createElement("div");
    collapse.id = itemId;
    collapse.className = "accordion-collapse collapse";
    collapse.setAttribute("data-bs-parent", "#mainFiltersAccordion");

    const body = document.createElement("div");
    body.className = "accordion-body";

    // Opzioni (manteniamo il layout a due colonne per Country)
    if (label === "Country") {
        const perCol = Math.ceil(options.length / 3);
        const row = document.createElement("div");
        row.className = "row";
        const col1 = document.createElement("div");
        const col2 = document.createElement("div");
        const col3 = document.createElement("div");
        col1.className = "col-4";
        col2.className = "col-4";
        col3.className = "col-4";

        options.forEach((opt, i) => {
            const chk = createCheckbox(label, opt); // già esistente nel file
            if (i < perCol) col1.appendChild(chk);
            else if (i < perCol * 2) col2.appendChild(chk);
            else col3.appendChild(chk);
        });

        row.appendChild(col1);
        row.appendChild(col2);
        row.appendChild(col3);
        body.appendChild(row);
        } else {
        options.forEach(opt => {
            const chk = createCheckbox(label, opt); // già esistente nel file
            body.appendChild(chk);
        });
        }

        collapse.appendChild(body);
        item.appendChild(h);
        item.appendChild(collapse);
        accordion.appendChild(item);
    });

    container.appendChild(accordion);
    
    
}

function setupAdvancedFilterInteraction(data) {
    const container = document.getElementById("advanced-filter-labels");
    container.innerHTML = ""; // Pulisce il contenuto esistente
    
    const filters = {
        "School Grades Included": extractGrades(data).sort((a, b) => {
            const order = [
                "First Grade",
                "Second Grade",
                "Third Grade",
                "Fourth Grade",
                "Fifth Grade",
                "Sixth Grade",
                "Seventh Grade",
                "Eighth Grade",
                "Ninth Grade",
                "Tenth Grade",
                "Eleventh Grade",
                "Twelfth Grade",
                "Thirteenth Grade"
            ];
            return order.indexOf(a) - order.indexOf(b);
        }),
        "Type of Skills Analysed": extractByPrefix(data, "Type of Skills Analysed [").sort((a, b) => {
            const order = [
                "Literacy",
                "Numeracy",
                "Science",
                "Foreign Language",
                "Other Skills"
            ];
            return order.indexOf(a) - order.indexOf(b);
        }),
        "Measure Type": extractByPrefix(data, "Measure Type ["),
        "Sample Type": extractByPrefix(data, "Sample Type [").sort((a, b) => {
            const order = [
                "Student Population",
                "Random Student Sample",
                "Non-random Student Sample",
                "Other"
            ];
            return order.indexOf(a) - order.indexOf(b);
        }),
        "Sample Unit": extractByPrefix(data, "Sample Unit [").sort((a, b) => {
            const order = [
                "Countries/Cities",
                "Schools",
                "Classes",
                "Pupils"
            ];
            return order.indexOf(a) - order.indexOf(b);
        })
    };
    
    const accordion = document.createElement("div");
    accordion.className = "accordion";
    accordion.id = "advancedFiltersAccordion";

    let idx=0;
    Object.entries(filters).forEach(([label, options]) => {
    const itemId = `advFilter-${idx++}`;
    const item = document.createElement("div");
    item.className = "accordion-item";

    // Header
    const h = document.createElement("h2");
    h.className = "accordion-header";

    const btn = document.createElement("button");
    btn.className = "accordion-button collapsed";
    btn.type = "button";
    btn.setAttribute("data-bs-toggle", "collapse");
    btn.setAttribute("data-bs-target", `#${itemId}`);
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", itemId);
    btn.textContent = label;
    h.appendChild(btn);

    // Corpo/collapse
    const collapse = document.createElement("div");
    collapse.id = itemId;
    collapse.className = "accordion-collapse collapse";
    collapse.setAttribute("data-bs-parent", "#advancedFiltersAccordion");

    const body = document.createElement("div");
    body.className = "accordion-body";

    // Layout speciale per "School Grades Included" (3 colonne). Cambia a 2 se preferisci.
    if (label.toLowerCase().includes("school grades")) {
        const perCol = Math.ceil(options.length / 3);
        const row = document.createElement("div");
        row.className = "row";

        const mkCol = () => {
            const c = document.createElement("div");
            c.className = "col-12 col-md-4";
            return c;
        };
        const col1 = mkCol(), col2 = mkCol(), col3 = mkCol();

        options.forEach((opt, i) => {
            const checkbox = createCheckbox(label, opt);
            if (i < perCol) col1.appendChild(checkbox);
            else if (i < perCol * 2) col2.appendChild(checkbox);
            else col3.appendChild(checkbox);
        });

        row.appendChild(col1);
        row.appendChild(col2);
        row.appendChild(col3);
        body.appendChild(row);
        } else {
        // Tutti gli altri: semplice lista di checkbox
        options.forEach(opt => {
            const checkbox = createCheckbox(label, opt);
            body.appendChild(checkbox);
        });
        }

        collapse.appendChild(body);
        item.appendChild(h);
        item.appendChild(collapse);
        accordion.appendChild(item);
    });

    container.appendChild(accordion);
    
    
}

function setupDataVariablesInteraction(data) {
    const container = document.getElementById("data-variables-labels");
    container.innerHTML = "";

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

    // Wrapper accordion
    const accordion = document.createElement("div");
    accordion.className = "accordion";
    accordion.id = "dataVarsAccordion";

    let idx = 0;
    Object.entries(groupedFields).forEach(([sectionLabel, fields]) => {
    const itemId = `dataVars-${idx++}`;
    const item = document.createElement("div");
    item.className = "accordion-item";

    // Header
    const h = document.createElement("h2");
    h.className = "accordion-header";

    const btn = document.createElement("button");
    btn.className = "accordion-button collapsed";
    btn.type = "button";
    btn.setAttribute("data-bs-toggle", "collapse");
    btn.setAttribute("data-bs-target", `#${itemId}`);
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", itemId);
    btn.textContent = sectionLabel;
    h.appendChild(btn);

    // Corpo/collapse
    const collapse = document.createElement("div");
    collapse.id = itemId;
    collapse.className = "accordion-collapse collapse";
    collapse.setAttribute("data-bs-parent", "#dataVarsAccordion");

    const body = document.createElement("div");
    body.className = "accordion-body";

    // Costruisco l’elenco di variabili disponibili (come nel tuo codice)
    const uniqueVars = new Set();
    data.forEach(entry => {
        fields.forEach(field => {
            const fieldName = field.label;
            if (entry[fieldName] && entry[fieldName].toLowerCase() !== "n/a" && entry[fieldName] !== "-") {
            uniqueVars.add(fieldName);
            }
        });
    });

    // Render checkbox variabili
   const varsArr = Array.from(uniqueVars); // se vuoi ordine alfabetico: .sort()

    const isTwoColsSection =
    sectionLabel === "Students' Information" ||
    sectionLabel === "Household's Information";

    if (isTwoColsSection) {
    const perCol = Math.ceil(varsArr.length / 2);

    const row = document.createElement("div");
    row.className = "row";

    const mkCol = () => {
        const c = document.createElement("div");
        c.className = "col-12 col-md-6"; // 1 colonna su mobile, 2 da md in su
        return c;
    };
    const col1 = mkCol(), col2 = mkCol();

    varsArr.forEach((varName, i) => {
        const labelEl = document.createElement("label");
        labelEl.className = "checkbox-label";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = varName;
        input.dataset.filter = varName; // fondamentale per i filtri

        labelEl.appendChild(input);
        labelEl.append(` ${varName}`);

        if (i < perCol) col1.appendChild(labelEl);
        else col2.appendChild(labelEl);
    });

    row.appendChild(col1);
    row.appendChild(col2);
    body.appendChild(row);
    } else {
    // Sezioni restanti: lista singola
    varsArr.forEach(varName => {
        const labelEl = document.createElement("label");
        labelEl.className = "checkbox-label";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = varName;
        input.dataset.filter = varName;

        labelEl.appendChild(input);
        labelEl.append(` ${varName}`);
        body.appendChild(labelEl);
    });
    }

    collapse.appendChild(body);
    item.appendChild(h);
    item.appendChild(collapse);
    accordion.appendChild(item);
    });

    container.appendChild(accordion);
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
    const longitudinalStructure = getField(entry, "Longitudinal Data Structure");
    const longitudinalTypes = getField(entry, "Type of Longitudinal Data");
    const purposesList = extractBracketedValues(entry, "Data Collection Purpose [");
    const focusList = extractBracketedValues(entry, "Data Collection Focus [");

    const frequency = getField(entry, "Data Collection Frequency");
    const startingYear = getField(entry, "Starting Year");
    const endingYear = getField(entry, "Ending Year");

    const ecec = getField(entry, "Information on ECEC or Pre-Primary Education");
    const includedGrades = sortSchoolGrades(extractBracketedValues(entry, "School Grades Included ["));
    const afterSchool = getField(entry, "Students Followed After School Education");

    let skills = extractBracketedValues(entry, "Type of Skills Analysed [");
    const otherDetails = getField(entry, "Other Skills (Details)");

    skills = skills.map(skill => {
        if (skill.toLowerCase() === "other skills" && otherDetails && otherDetails !== "N/A") {
            const clickableDetails = makeLinksClickable(otherDetails.replace(/;/g, ", "));
            return `Other Skills: ${clickableDetails}`;
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
    <link rel='stylesheet' href='assets/style.css'>
    <style>
        body {padding:20px}
        h1 {font-size:35px !important}
        h2 {margin-top:40px}
        h3, h4 {margin-bottom:0}
        a {color:#006EC4} a:hover {color:#666}
        .toolbar {position:sticky; top:0; background:#fff; padding:10px 0 16px; display:flex; gap:10px; border-bottom:1px solid #eee; margin-bottom:16px}
        .btn-dl {border:1px solid #ccc; border-radius:8px; padding:8px 12px; cursor:pointer; background:#f7f7f7}
        .btn-dl:hover {background:#eee}
        .muted {color:#666; font-size:12px}
    </style>
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
    </head>
    <body>

    <h1>${name}</h1>
    <p><strong>Acronym:</strong> ${acronym}</p>
    <p>${description}</p>

    <h2>Main Information</h2>
    <p><strong>Country:</strong> ${decodeURIComponent(code)}</p>
    <p><strong>Responsible Organization(s):</strong> ${responsibleOrgs.join(", ") || "N/A"}</p>
    <p><strong>Longitudinal Data Structure:</strong> ${longitudinalStructure || "N/A"} Data</p>
    <p><strong>Type of Longitudinal Data:</strong> ${longitudinalTypes || "N/A"} Data</p>
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
    ${showSamplingCriteria && samplingCriteria !== "N/A" ? `<p><strong>Sampling Weights/Criteria:</strong> ${samplingCriteria}</p>` : ""}
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

    <script>
        // 1) Prepara un oggetto "piatto" con TUTTI i campi dell'entry
        const raw = ${JSON.stringify(entry)};
        const flat = {};
        for (const [k, v] of Object.entries(raw)) {
        if (v === null || v === undefined) { flat[k] = ""; continue; }
        // i valori del JSON sono già stringhe; comunque serializziamo in sicurezza
        flat[k] = (typeof v === "string") ? v : JSON.stringify(v);
        }

        // 2) CSV (Field,Value)
        function escCSV(val){
        if (val == null) return "";
        const s = String(val);
        const needsQuotes = /[",\\n]/.test(s);
        const out = s.replace(/"/g, '""');
        return needsQuotes ? '"' + out + '"' : out;
        }
        function downloadCSV(){
        const rows = [["Field","Value"]];
        for (const [k,v] of Object.entries(flat)) rows.push([k, v]);
        const csv = rows.map(r => r.map(escCSV).join(",")).join("\\n");
        const blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = (${JSON.stringify(acronym || name)} || "dataset") + ".csv";
        document.body.appendChild(a); a.click(); a.remove();
        }

        // 3) XLSX con SheetJS se disponibile; altrimenti mostra un avviso
        function downloadXLSX(){
        if (!window.XLSX || !XLSX.utils || !XLSX.writeFile) {
            alert("Per l'export XLSX aggiungi SheetJS: \\n\\n<script src=\\"https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js\\"></script>");
            return;
        }
        const aoa = [["Field","Value"], ...Object.entries(flat)];
        const ws = XLSX.utils.aoa_to_sheet(aoa);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dataset");
        XLSX.writeFile(wb, (${JSON.stringify(acronym || name)} || "dataset") + ".xlsx");
        }

        document.getElementById("btnCsv").addEventListener("click",  downloadCSV);
        document.getElementById("btnXlsx").addEventListener("click", downloadXLSX);
    </script>

    </body>
    </html>
    `;



    const popup = window.open("", "_blank");
    if (popup) {
        popup.document.open();
        popup.document.write(htmlContent);
        popup.document.close();
    } else {
        alert("Pop-up blocked. Please allow pop-ups for this site.");
    }
}

function popoutDatasetByAcronym(countryName, acronym) {
    // Trova l'entry nel countryEntryStore usando l'acronimo
    const entries = countryEntryStore[countryName] || [];
    const index = entries.findIndex(e => getField(e, "Acronym") === acronym);
    
    if (index === -1) {
        console.error(`Dataset con acronimo "${acronym}" non trovato in ${countryName}`);
        alert(`Errore: Dataset "${acronym}" non trovato.`);
        return;
    }
    
    // Richiama la funzione popoutDataset con i parametri corretti
    popoutDataset(countryName, index);
}

function handleBackButton() {

    if (previousModalState?.type === "country" && previousModalState.code) {
        const { code } = previousModalState;
        openDbModal(previousModalState.code);
    }
    previousModalState = null;
    updateBackButtonVisibility();
}

function updateBackButtonVisibility() {
    const backButton = document.getElementById("modal-back-button");
    if (previousModalState) {
        backButton.style.display = "inline-block";
    } else {
        backButton.style.display = "none";
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
    
        
        
        
        
/**
 * Funzione chiamata da api.js dopo aver caricato i dati dal database
 * Inizializza tutti i componenti che dipendono dai dati
 */
function initializeWithData(data) {
    console.log("📊 Inizializzazione con dati dal database:", data.length, "datasets");
    
    mappingData = data;
    window.filteredDataForSearch = data;
    
    // Popola i filtri
    if (typeof populateCountryFilter === 'function') {
        populateCountryFilter();
    }
    
    // Setup filtri interattivi
    if (typeof setupMainFilterInteraction === 'function') {
        setupMainFilterInteraction(mappingData);
    }
    if (typeof setupAdvancedFilterInteraction === 'function') {
        setupAdvancedFilterInteraction(mappingData);
    }
    if (typeof setupDataVariablesInteraction === 'function') {
        setupDataVariablesInteraction(mappingData);
    }
    
    // Aggiorna placeholder ricerca
    const searchInput = document.getElementById("search-input");
    if (searchInput && searchInput.value.trim() === "") {
        searchInput.placeholder = `Search among ${mappingData.length} datasets`;
    }
    
    // Inizializza mappa se geojson è pronto
    if (geojsonLoaded) {
        console.log("Chiamo initMap da initializeWithData");
        initMap();
    }
    
    checkIfReady();
    
    console.log("✅ Inizializzazione completata");
}

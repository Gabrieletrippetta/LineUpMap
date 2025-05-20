

function getSearchFilters() {
    const search = document.getElementById('search-input').value.trim().toLowerCase();
    
    const selectedFilters = [];
    document.querySelectorAll('.dropdown-menu input[type="checkbox"]:checked').forEach(cb => {
        selectedFilters.push(cb.value);
    });
    
    return { search, selectedFilters };
}

function filterMappingData(data, filters) {
    console.log("Filtraggio attivo su: ", filters);
    return data.filter(entry => {
        const name = getField(entry, "Dataset Name").toLowerCase();
        const acronym = getField(entry, "Dataset Acronym").toLowerCase();
        
        const matchesSearch = !filters.search || name.includes(filters.search) || acronym.includes(filters.search);
        
        const matchesDropdowns = filters.selectedFilters.length === 0 || filters.selectedFilters.every(val => {
            return Object.values(entry).some(v => v && typeof v === "string" && v.toLowerCase().includes(val.toLowerCase()));
        });
        
        return matchesSearch && matchesDropdowns;
    });
}

function applyFilters() {
    console.log("applyFilters è chiamata")
    // if (!window.mappingData) return;

    const filters = getSearchFilters();
    const filteredData = filterMappingData(mappingData, filters);
    console.log("FilteredData:", filteredData);

    if (!filters.search && filters.selectedFilters.length === 0) {
        alert("Please enter a search term or select at least one filter.");
        return;
    }

    // Mostra il modale
    const modal = document.getElementById("db-modal");
    const modalContent = document.getElementById("modal-db-list");
    const modalTitle = document.getElementById("modal-country-title");

    modalTitle.textContent = "Search Results";
    modalContent.innerHTML = ""; // Pulisce i risultati precedenti
    modal.classList.add("show");
    console.log("✔️ Classe 'show' aggiunta al modale");
    console.log("Classi attuali:", modal.classList);

    if (filteredData.length === 0) {
        modalContent.innerHTML = "<p>No datasets found.</p>";
        return;
    }


    filteredData.forEach((entry, index) => {
        const div = document.createElement("div");
        div.className = "db-entry";

        const country = getField(entry, "Country");
        const name = getField(entry, "Dataset Name");
        const acronym = getField(entry, "Dataset Acronym");
        const description = getField(entry, "Short Description");

        div.innerHTML = `
            <b>Country:</b> ${country}<br>
            <b>Name:</b> ${name}<br>
            <b>Acronym:</b> ${acronym}<br>
            <br>
            ${description}<br>
            <button class="expand-button" onclick="openFilteredDbModal(${index})">Show more</button>
        `;
        modalContent.appendChild(div);
    });

    console.log("applyFilters chiamato, risultati:", filteredData);

    // Salva i risultati temporaneamente
    window.filteredResults = filteredData;
}

function openFilteredDbModal(index) {
    const entry = window.filteredResults?.[index];
    if (!entry) return;

    const modal = document.getElementById("db-modal");
    const title = document.getElementById("modal-country-title");
    const container = document.getElementById("modal-db-list");

    title.textContent = `Detailed Info - ${getField(entry, "Name")}`;
    container.innerHTML = "";

    const dbDiv = document.createElement("div");
    dbDiv.className = "db-entry";

    const role = localStorage.getItem("userRole");
    const name = getField(entry, "Dataset Name");
    const acronym = getField(entry, "Dataset Acronym");
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
        .map(([_, val]) => val)
        .join(", ") || "N/A";

    let access = getField(entry, "Data Accessibility");
    if (access === "Other") access = getField(entry, "Data Accessibility [Other]");
    if (!access || access === "-") access = "N/A";

    if (role === "researcher") {
        const sampleLevel = getField(entry, "Sample Level");

        const skills = Object.entries(entry)
            .filter(([k, v]) => k.includes("Type of Skills Analysed") && v && v !== "-")
            .map(([k, v]) => {
                if (k.includes("Other Skills")) {
                    const other = getField(entry, "Type of Skills Analysed [Other Skills]");
                    return other !== "N/A" ? other : v;
                }
                return v;
            }).join(", ") || "N/A";

        let assessment = getField(entry, "Assessment Type");
        if (assessment === "Other") {
            assessment = getField(entry, "Assessment Type [Other]");
        }

        const linkability = Object.entries(entry)
            .filter(([k, v]) => k.includes("Data Linkability at Individual Level") && v && v !== "-")
            .map(([_, v]) => v)
            .join(", ") || "N/A";

        let microdataDisplay = "";
        const microdataLinks = Object.entries(entry)
            .filter(([key, val]) => key.startsWith("Access to Micro-Data") && typeof val === "string")
            .map(([_, val]) => {
                const match = val.match(/https?:\/\/[^\s"]+/);
                return match ? `<a href="${match[0]}" target="_blank">${match[0]}</a>` : val;
            });

        if (microdataLinks.length > 0) {
            microdataDisplay = `<b>Access to Micro-Data:</b> ${microdataLinks.join(", ")}<br>`;
        }

        let accessLabel = "Access to Micro-Data";
        let accessDisplay = "N/A";

        let rawAccess = getField(entry, "Data Accessibility");
        if (rawAccess === "Other") rawAccess = getField(entry, "Data Accessibility [Other]");

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
            const microdata = Object.entries(entry)
                .filter(([k, v]) => k.startsWith("Access to Micro-Data") && v && v !== "-")
                .map(([_, v]) => v)
                .join(", ") || "N/A";
            accessDisplay = microdata;
        }

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
}


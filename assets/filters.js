let jsonData = []; // Popolato dopo il fetch

// Carica il file JSON
fetch("mapping_data.json")
  .then((response) => response.json())
  .then((data) => {
    jsonData = data;
  });

// Ricerca per parola chiave
function searchByKeyword(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  const results = [];

  jsonData.forEach((entry) => {
    const matchedFields = {};

    for (const [key, value] of Object.entries(entry)) {
      if (value && value.toString().toLowerCase().includes(lowerKeyword)) {
        if (!matchedFields[key]) matchedFields[key] = value;
      }
    }

    if (Object.keys(matchedFields).length > 0) {
      results.push({
        entry,
        matches: matchedFields,
      });
    }
  });

  showResultsModal(results, keyword);
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

// Visualizza i risultati in un modale
function showResultsModal(results, title) {
  const modal = document.getElementById("db-modal");
  const modalTitle = document.getElementById("modal-country-title");
  const modalContent = document.getElementById("modal-db-list");

  modalTitle.textContent = `Results for: ${title}`;
  modalContent.innerHTML = "";

  if (results.length === 0) {
    modalContent.innerHTML = "<p>No results found.</p>";
  } else {
    results.forEach((result) => {
      const e = result.entry || result; // nel caso della ricerca con checkbox, result è già l’oggetto intero
      const item = document.createElement("div");
      item.classList.add("db-item");

      item.innerHTML = `
        <h4>${e.Name || "Unnamed Dataset"}</h4>
        <p><strong>${e.Acronym || ""}</strong></p>
        <p>${e["Short Description"] || ""}</p>
      `;
      modalContent.appendChild(item);
    });
  }

  modal.style.display = "block";
}


document.getElementById("search-input").addEventListener("input", function () {
  const val = this.value.trim();
  if (val.length >= 3) searchByKeyword(val);
});
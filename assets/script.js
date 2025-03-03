document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (token) {
        fetch("http://localhost:3000/profile", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                document.getElementById("auth-container").style.display = "none"; // Nasconde il pulsante Register/Login
                document.getElementById("user-info").style.display = "block";
                document.getElementById("user-name").innerText = data.user.username;

                // Se l'utente è un ricercatore, mostra gli strumenti avanzati
                if (data.user.role === "researcher") {
                    document.getElementById("advanced-tools").style.display = "block";
                }
            }
        })
        .catch(error => {
            console.error("Error verifying token:", error);
            logout();
        });
    }
    // Aggiungere evento per il pulsante logout
    document.getElementById("logout-btn").addEventListener("click", logout);
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/auth.html"; // Reindirizza alla pagina di autenticazione
}

document.getElementById("auth-container").addEventListener("click", () => {
    window.location.href = "auth.html";
});

var map = L.map('map').setView([54.5260, 14.5551], 4);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        var countries = { "AT": [47.5162, 14.5501], "BE": [50.8503, 4.3517], "BG": [42.7339, 25.4858], "HR": [45.1, 15.2], "CY": [35.1264, 33.4299], "CZ": [49.8175, 15.4729], "DK": [56.2639, 9.5018], "EE": [58.5953, 25.0136], "FI": [61.9241, 25.7482], "FR": [46.6034, 1.8883], "DE": [51.1657, 10.4515], "GR": [39.0742, 21.8243], "HU": [47.1625, 19.5033], "IE": [53.4129, -8.2439], "IT": [41.8719, 12.5674], "LV": [56.8796, 24.6032], "LT": [55.1694, 23.8813], "LU": [49.8153, 6.1296], "MT": [35.9375, 14.3754], "NL": [52.1326, 5.2913], "PL": [51.9194, 19.1451], "PT": [39.3999, -8.2245], "RO": [45.9432, 24.9668], "SK": [48.669, 19.699], "SI": [46.1512, 14.9955], "ES": [40.4637, -3.7492], "SE": [60.1282, 16.0435], "IS": [64.9631, -19.0208], "LI": [47.166, 9.5554], "NO": [60.472, 8.4689], "CH": [46.8182, 8.2275], "UK": [53.3781, -1.436] };

        Object.keys(countries).forEach(country => {
            var customIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            var marker = L.marker(countries[country], {icon: customIcon}).addTo(map);
            marker.on('click', function() { loadCsvList(country, marker); });
        });

        function loadCsvList(country, marker) {
            fetch(`http://localhost:3000/data/${country}`)
                .then(response => response.json())
                .then(files => {
                    if (files.length === 0) {
                        marker.bindPopup("<b>No data for " + country + "</b>").openPopup();
                        return;
                    }
                    let popupContent = `<b>${country}</b><br><ul>`;
                    files.slice(0, 5).forEach(file => {
                        popupContent += `<li><button class="csv-button" onclick="fetchAndShowChart('${country}', '${file}')">${file}</button></li>`;
                    });
                    if (files.length > 5) {
                        popupContent += `<li><button class="expand-button" onclick="expandCsvList('${country}')">Show all</button></li>`;
                    }
                    popupContent += "</ul>";
                    marker.bindPopup(popupContent).openPopup();
                    marker.files = files; // Salva i file nel marker per l'espansione
                })
                .catch(err => console.error("Error in CSV file retrieval:", err));
        }

        document.addEventListener("DOMContentLoaded", function() {
            let countrySelect = document.getElementById('filterCountry');
            
            // Aggiunge le opzioni al select
            Object.keys(countries).forEach(country => {
                let option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });

            countrySelect.addEventListener('change', function() {
                if (this.value === 'all') {
                    this.selectedIndex = 0; 
                }
            });
        });

        function searchData() {
            let query = document.getElementById('searchInput').value.toLowerCase();
            let countryFilter = document.getElementById('filterCountry').value;
            let educationFilter = document.getElementById('filterEducation').value;
            let dataAvailabilityFilter = document.getElementById('filterDataAvailability').value;

            let searchParams = new URLSearchParams({
                q: query,
                country: countryFilter,
                education: educationFilter,
                availability: dataAvailabilityFilter
            });

            fetch(`http://localhost:3000/search?${searchParams.toString()}`)
                .then(response => response.json())
                .then(results => {
                    if (results.length === 0) {
                        alert("Nessun dato trovato per la ricerca: " + query);
                        return;
                    }
                    results.forEach(result => {
                        fetchAndShowChart(result.country, result.file);
                    });
                })
                .catch(err => console.error("Error in data search:", err));
        }

        function expandCsvList(country) {
            map.eachLayer(layer => {
                if (layer instanceof L.Marker && layer.getPopup()) {
                    let popup = layer.getPopup();
                    if (popup && popup.getContent().includes(country)) {
                        let files = layer.files || [];
                        let expandedPopupContent = `<b>${country}</b><br><ul>`;
                        files.forEach(file => {
                            expandedPopupContent += `<li><button class="csv-button" onclick="fetchAndShowChart('${country}', '${file}')">${file}</button></li>`;
                        });
                        expandedPopupContent += "</ul>";
                        layer.bindPopup(expandedPopupContent).openPopup();
                    }
                }
            });
        }
            
        let popupRow = 0;
        let popupColumn = 0;
        const maxPopupsPerColumn = 3;

        let openPopups = []; // Array che tiene traccia delle posizioni dei popup aperti
        const popupWidth = 420;
        const popupHeight = 260;
        const margin = 20; // Margine tra i popup
        
        function createChartPopup(country, csvData, csvFile) {
            let popup = document.createElement('div');
            popup.classList.add('chart-popup');
            
            // Dimensioni massime dello schermo
            let maxX = window.innerWidth - popupWidth - margin;
            let maxY = window.innerHeight - popupHeight - margin;
        
            // Trova una posizione libera
            let left = 50, top = 50;
            let positionFound = false;
        
            for (let y = 50; y <= maxY; y += popupHeight + margin) {
                for (let x = 50; x <= maxX; x += popupWidth + margin) {
                    let overlaps = openPopups.some(p => Math.abs(p.left - x) < popupWidth && Math.abs(p.top - y) < popupHeight);
                    if (!overlaps) {
                        left = x;
                        top = y;
                        positionFound = true;
                        break;
                    }
                }
                if (positionFound) break;
            }
        
            // Se lo schermo è pieno, imposta il popup in una posizione casuale disponibile
            if (!positionFound) {
                left = Math.random() * (maxX - 50) + 50;
                top = Math.random() * (maxY - 50) + 50;
            }
        
            popup.style.left = `${left}px`;
            popup.style.top = `${top}px`;
        
            openPopups.push({ left, top, element: popup });
        
            let closeButton = document.createElement('button');
            closeButton.classList.add('close-btn');
            closeButton.innerText = '✖';
            closeButton.style.float = 'right';
            closeButton.onclick = () => {
                popup.remove();
                openPopups = openPopups.filter(p => p.element !== popup); // Libera la posizione
            };
        
            let title = document.createElement('h3');
            let fileTitle = csvFile.replace(".csv", "")
            title.innerText = `${country} Data - ${fileTitle}`;

            //Select per cambiare tipo di grafico
            let chartTypeSelect = document.createElement('select');
            chartTypeSelect.innerHTML = `
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="scatter">Scatter</option>
                <option value="bubble">Bubble</option>
            `;
            chartTypeSelect.style.marginBottom ="10px";
        
            let canvasWrapper = document.createElement('div');
            let canvas = document.createElement('canvas');
            canvasWrapper.appendChild(canvas);
        
            popup.appendChild(closeButton);
            popup.appendChild(title);
            popup.appendChild(chartTypeSelect);
            popup.appendChild(canvasWrapper);
            document.body.appendChild(popup);
        
            let ctx = canvas.getContext('2d');
            let chart = createChart(ctx, csvData, "line"); // Grafico di default
        
            // Cambia il grafico quando si seleziona un nuovo tipo
            chartTypeSelect.addEventListener("change", () => {
                chart.destroy(); // Rimuove il vecchio grafico
                chart = createChart(ctx, csvData, chartTypeSelect.value); // Crea il nuovo grafico con il tipo selezionato
            });

            makePopupDraggable(popup);
        }
        
        //Questa funzione genera il grafico nel formato selezionato
        function createChart(ctx, csvData, chartType) {
            let labels = csvData.map(row => Object.keys(row)[0]);
            let values = csvData.map(row => parseFloat(Object.values(row)[1]) || 0);

            return new Chart(ctx, {
                type: chartType, 
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Value",
                        data: values,
                        borderColor: 'blue',
                        backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        function makePopupDraggable(popup) {
            let offsetX, offsetY, isDragging = false;
            popup.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - popup.offsetLeft;
                offsetY = e.clientY - popup.offsetTop;
                popup.style.zIndex = 1001;
            });
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    popup.style.left = `${e.clientX - offsetX}px`;
                    popup.style.top = `${e.clientY - offsetY}px`;
                }
            });
            document.addEventListener('mouseup', () => {
                isDragging = false;
                popup.style.zIndex = 1000;
            });
        }

        function fetchAndShowChart(country, csvFile) {
            fetch(`http://localhost:3000/data/${country}/${csvFile}`)
                .then(response => response.json())
                .then(csvData => {
                    if (!csvData.length) {
                        alert("Il file CSV è vuoto.");
                        return;
                    }
                    createChartPopup(country, csvData, csvFile);
                })
                .catch(err => console.error("Errore nel caricamento CSV:", err));
        }

        function updateChart(canvas, csvData) {
            new Chart(canvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: csvData.map(row => Object.keys(row)[0]),
                    datasets: [{
                        label: "Valori",
                        data: csvData.map(row => parseFloat(Object.values(row)[1]) || 0),
                        borderColor: 'blue',
                        fill: false
                    }]
                }
            });
        }

        function uploadFiles() {
            let fileInput = document.getElementById("fileInput");
            let files = fileInput.files;
        
            if (files.length === 0) {
                alert("Seleziona almeno un file da caricare.");
                return;
            }
        
            let formData = new FormData();
            for (let file of files) {
                formData.append("files", file);
            }
        
            fetch("./upload", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("File caricati con successo!");
                } else {
                    alert("Errore nel caricamento dei file.");
                }
            })
            .catch(error => console.error("Errore durante l'upload:", error));
        }
        
document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const role = document.getElementById("register-role").value;

    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
        // ✅ Svuota i campi del form dopo la registrazione
        usernameInput.value = "";
        passwordInput.value = "";
        roleSelect.selectedIndex = 0; // Resetta il menu a tendina
    }
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html"; // Reindirizza alla home
    } else {
        alert(data.message);
    }
});

document.getElementById("back-to-map").addEventListener("click", () => {
    window.location.href = "index.html"; // Reindirizza alla mappa
});

const darkModeIcon = document.getElementById("darkmode-icon");
const body = document.body;
const table = document.getElementById("order-table");

function applyDarkModeStyles(isDark) {
    const formControls = document.querySelectorAll(".form-control");
    const inputGroups = document.querySelectorAll(".input-group-text");

    formControls.forEach(el => {
        el.style.transition = "all 0.5s ease";
        el.style.backgroundColor = isDark ? "#2c2c2c" : "#fffff";
        el.style.color = isDark ? "#f1f1f1" : "#000000";
        el.style.borderColor = isDark ? "#555" : "#ced4da";
    });

    inputGroups.forEach(el => {
        el.style.transition = "all 0.5s ease";
        el.style.backgroundColor = isDark ? "#2c2c2c" : "#fffff";
        el.style.color = isDark ? "#f1f1f1" : "#000000";
        el.style.borderColor = isDark ? "#555" : "#ced4da";
    });
}

// Initial theme on load
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    table.classList.add("table-dark");
    darkModeIcon.src = "client/assets/images/sun.png";
}

// darkmode button
darkModeIcon.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    const isDark = body.classList.contains("dark-mode");

    // Table class toggle
    table.classList.toggle("table-dark", isDark);

    if (isDark) {
        table.classList.add("table-dark");
        localStorage.setItem("theme", "dark");
        darkModeIcon.src = "client/assets/images/sun.png";
    } else {
        table.classList.remove("table-dark");
        localStorage.setItem("theme", "light");
        darkModeIcon.src = "client/assets/images/moon.png";
    }

    // applyDarkModeStyles(isDark);
});
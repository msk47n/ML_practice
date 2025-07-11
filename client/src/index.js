const darkModeIcon = document.getElementById("darkmode-icon");
const body = document.body;
const table = document.getElementById("order-table");

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
});
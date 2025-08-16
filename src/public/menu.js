const menuToggle = document.getElementById("menuToggle");
const sideMenu = document.getElementById("sideMenu");

// Abrir / cerrar menú
menuToggle.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
});

// Cerrar menú al hacer clic en una opción
document.querySelectorAll(".side-menu .nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        sideMenu.classList.remove("open");
    });
});

let menuOpen = false;
document.getElementById("menu-btn").addEventListener("click", (ev) => {
    document.getElementById("content-container").style.transition = "margin 500ms";
    document.getElementById("menu-btn").classList.toggle("open");
    if (menuOpen) {
        document.getElementById("sidebar-content-container").style.transitionDelay = "0ms";
        document.getElementById("sidebar-content-container").style.visibility = "hidden";
        document.getElementById("content-container").style.marginLeft = "0";
        document.getElementById("sidebar").style.width = "0";
        menuOpen = false;
    } else {
        document.getElementById("sidebar-content-container").style.transitionDelay = "500ms";
        document.getElementById("sidebar-content-container").style.visibility = "visible";
        document.getElementById("content-container").style.marginLeft = "200px";
        document.getElementById("sidebar").style.width = "200px";
        menuOpen = true;
    }
})

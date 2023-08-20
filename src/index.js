document.addEventListener("DOMContentLoaded", () => {
    const sectionContainer = document.getElementById("app");

    // Load default section
    loadSection("sections/main.html");

    // Handle navigation to load different sections
    const navigationLinks = document.querySelectorAll(".navigation-link");
    navigationLinks.forEach(link => {
        link.addEventListener("click", event => {
            const sectionToLoad = event.target.getAttribute("data-section");
            loadSection(sectionToLoad);
        });
    });

    // Function to load sections
    function loadSection(sectionURL) {
        fetch(sectionURL)
            .then(response => response.text())
            .then(data => {
                sectionContainer.innerHTML = data;
            })
            .catch(error => {
                console.error("Error loading section:", error);
            });
    }
});
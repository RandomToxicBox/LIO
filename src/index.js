document.addEventListener("DOMContentLoaded", () => {
    const sectionContainer = document.getElementById("app");

    loadSection("sections/main.html");

    const navigationLinks = document.querySelectorAll(".lio-nav__item");

    activateTab('main', navigationLinks, 'lio-nav__item_active')

    navigationLinks.forEach(link => {
      link.addEventListener("click", event => {
            const sectionToLoad = event.target.getAttribute("data-section");
            activateTab(sectionToLoad, navigationLinks, 'lio-nav__item_active')
            loadSection(`sections/${sectionToLoad}.html`);
        });
    });

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

function activateTab(activeSection, elements, className) {
    Array.from(elements).find(el => el.getAttribute('data-section') === activeSection).classList.add(className);
    Array.from(elements).filter(el => el.getAttribute('data-section') !== activeSection).forEach(el => el.classList.remove(className));
}
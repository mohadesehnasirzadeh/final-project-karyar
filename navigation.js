function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetPage = link.getAttribute("data-page");

      navLinks.forEach((nav) => nav.classList.remove("active"));
      link.classList.add("active");

      pages.forEach((page) => page.classList.remove("active"));

      if (targetPage === "github") {
        document.getElementById("github-page").classList.add("active");
      } else {
        document.getElementById(`${targetPage}-page`).classList.add("active");
      }

      updatePageTitle(targetPage);
    });
  });
}

function updatePageTitle(page) {
  const titles = {
    github: "GitHub User Search",
    time: "Time App",
    weather: "Weather App",
  };

  document.title = `${titles[page]} - Karyar Final Project`;
}

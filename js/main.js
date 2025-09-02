// Select all nav links
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function () {
        // remove active class from all
        navLinks.forEach(l => l.classList.remove('active'));
        // add active to the clicked one
        this.classList.add('active');
    });
});

const scrollBtn = document.getElementById("scrollTopBtn");

scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
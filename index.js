document.addEventListener("DOMContentLoaded", function() {
const image = document.querySelector(".full-screen-image")

image.addEventListener("click", function() {
  window.location.pathname = "/about";
})

  const navbar = document.querySelector(".navbar");

  if (navbar && window.location.pathname === "/") {
    navbar.style.display = "none";
  }



  setTimeout(function () {
    const homeName = document.querySelector(".home-name");
    homeName.classList.add("show"); // Add 'show' class after 2 seconds to trigger the fade-in
  }, 1000); // Delay of 2000ms (2 seconds)

});

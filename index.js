document.addEventListener("DOMContentLoaded", function() {
const image = document.querySelector(".full-screen-image")

if (image){
image.addEventListener("click", function() {
  window.location.pathname = "/about";
})
}
  const navbar = document.querySelector(".navbar");

  if (navbar && window.location.pathname === "/") {
    navbar.style.backgroundColor = "white";
    const menuIcon = document.querySelector(".menu-icon");
    menuIcon.style.display = "none"
  }


  const logoLink = document.querySelector(".logo a");
  if (logoLink) {
    if (window.location.pathname === "/") {

      logoLink.setAttribute("href", "/about");
    } else {

      logoLink.setAttribute("href", "/");
    }
  }
});

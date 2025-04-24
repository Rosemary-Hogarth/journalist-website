document.addEventListener("DOMContentLoaded", function() {
const image = document.querySelector(".full-screen-image")

if (image){
image.addEventListener("click", function() {
  window.location.pathname = "/about";
})
}


  const navbar = document.querySelector(".navbar");

  if (navbar && window.location.pathname === "/") {
    navbar.style.display = "none";

  }


});

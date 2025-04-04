document.addEventListener("DOMContentLoaded", function() {
  function getRandomHexColor() {
    const colors = ["#B0C3E5", "#FFB3EB", "#F3F2E3", "#6CC59B"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const background = document.querySelector(".home-container");

    if (background) {
    background.style.backgroundColor = getRandomHexColor();

    background.addEventListener("mouseenter", function() {
      background.style.backgroundColor = getRandomHexColor();
  });
  } else {
    console.error("Element with class 'home-container' not found!");
  }

  const homeName = document.getElementById("name");

  homeName.addEventListener("click", function() {
    window.location.href = "/about";
  });

  const navbar = document.querySelector(".navbar");
  if(navbar && window.location.pathname === "/") {
    navbar.style.display = "none";
  }

  })

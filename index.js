document.addEventListener("DOMContentLoaded", function() {

  const navbar = document.querySelector(".navbar");

  if (navbar && window.location.pathname === "/") {
    navbar.style.display = "none";

  }

  if (document.body.classList.contains('home-page')) {
    const navbar = document.querySelector('.navbar');
    navbar.style.display = 'none'; // Explicitly set to none
  }

  const slides = document.querySelectorAll('.home-slide');
  const nameSpans = document.querySelectorAll(".vertical-name span");
  const colors = ["#97D6B8", "#FFB3EB", "#B0C3E5"];

  let currentSlide = 0;

  // handles homepage slideshow by adding/removing active class
  function showSlide(n) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');

    // Update name color
    const color = colors[currentSlide % colors.length];
    nameSpans.forEach(span => {
      span.style.color = color;
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  // Show the first slide immediately and apply the first color
  showSlide(0);


  slides.forEach(slide => {
    slide.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Slide clicked');
      nextSlide();
    });
  });


  setTimeout(() => {
    setInterval(nextSlide, 3000);
  }, 3000);


});

document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.home-slide');

  let currentSlide = 0;


  function showSlide(n) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

    // Show the first slide immediately
    slides[0].classList.add('active');


  // Add click event listener to each slide
  slides.forEach(slide => {
    slide.addEventListener('click', function(e) {
      // Prevent the default anchor behavior
      e.preventDefault();

      console.log('Slide clicked');
      nextSlide()

      // Navigate to the exhibitions page
      //window.location.href = '/exhibitions';
    });
  });

  // Start the slideshow after 5 seconds
  setTimeout(() => {
    setInterval(nextSlide, 3000);
  }, 3000);


  function removePadding() {
    const navbar = document.querySelector(".navbar")
      if(navbar && window.location.pathname === "/") {
        navbar.style.marginBottom = '10px';
    }
  }
  removePadding()

  function newLinkNavbar() {
    const navbarHome = document.getElementById('navbar-home')
    if(navbarHome && window.location.pathname === "/") {
      navbarHome.href = '/exhibitions'
    }
  }
  newLinkNavbar()
});

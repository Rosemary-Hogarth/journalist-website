document.addEventListener('DOMContentLoaded', () => {
  // Hide navbar on homepage
  const navbar = document.querySelector(".navbar");
  if (navbar && window.location.pathname === "/") {
    navbar.style.display = "none";
  }

  // Slideshow logic
  const slides = document.querySelectorAll('.home-slide');
  const nameSpans = document.querySelectorAll(".vertical-name span");
  const colors = ["#97D6B8", "#FFB3EB", "#B0C3E5"];
  let currentSlide = 0;

  function showSlide(n) {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    const color = colors[currentSlide % colors.length];
    nameSpans.forEach(span => span.style.color = color);
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  showSlide(0);

  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (img) {
      img.addEventListener('click', function(e) {
        e.preventDefault();
        nextSlide();
        e.stopPropagation();
      });
    }
  });

  setTimeout(() => {
    setInterval(nextSlide, 3000);
  }, 3000);

  // --- ONLY ON HOMEPAGE: click-outside-image/menu redirect ---
  if (window.location.pathname === "/") {
    const slideshow = document.getElementById('slideshow');
    const menu = document.getElementById('menu');
    const menuHandle = document.querySelector('.menu-handle');

    document.addEventListener('click', function(e) {
      // Allow clicks on <img> in slideshow, menu, or menu-handle
      const clickedImg = e.target.tagName === 'IMG' && slideshow && slideshow.contains(e.target);
      const clickedMenu = menu && menu.contains(e.target);
      const clickedMenuHandle = menuHandle && menuHandle.contains(e.target);

      if (!(clickedImg || clickedMenu || clickedMenuHandle)) {
        window.location.href = '/work';
      }
    });
  }
});
